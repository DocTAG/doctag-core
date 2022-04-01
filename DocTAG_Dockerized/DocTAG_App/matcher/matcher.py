#
# QueryDocMatcher
#
# Author: Fabio Giachelle <fabio.giachelle.pro@gmail.com>
# URL: <https://github.com/giachell/query-doc-matcher>
# License: MIT

"""
QueryDocMatcher
This module provides several functions to obtain the matching words between a topic (query) and a document.
The matching words are computed by taking into account also stopwords removal, stemming and lemmatization.
The matching words are ranked by tf-idf scores.
There is also a demo function: `matcher.demo()`.
"""
import copy
import timeit
from operator import itemgetter
import nltk
from nltk.corpus import stopwords
from nltk.stem.snowball import SnowballStemmer
from nltk.stem import WordNetLemmatizer
from sklearn.feature_extraction.text import TfidfVectorizer
from gensim.parsing.preprocessing import preprocess_string, strip_tags, strip_punctuation, strip_short, \
    strip_multiple_whitespaces, strip_numeric, stem_text, remove_stopwords
# from logger import  IcLogger
import pandas as pd
import numpy as np


class QueryDocMatcher:
    def __init__(self, topic, doc, corpus, language="english", df_tfidf=None, k=10):
        self.topic = topic
        self.doc = doc
        self.corpus = corpus
        self.language = language
        self.k = k
        self.df_tfidf = df_tfidf
        self.bow_topic = set()
        self.bow_topic_not_stemmed = set()
        self.bow_doc = set()
        self.bow_doc_stemmed = set()
        self.matching_bow_stemmed = set()
        self.matching_bow = set()
        self.map_stemmed_bow_doc_to_not_stemmed = None
        self.map_stemmed_bow_topic_to_not_stemmed = None
        nltk.download('stopwords')

    def get_bag_of_words(self, text, text_type, stopwords_removal=True, stemming=True, lemmatization=False, verbose=False):
        """Return the bag of words for the given text according to the parameters specified (stopwords_removal, stemming and lemmatization).
        Parameters
        ----------
        text : string
            The text string from which we extract the bag of words
        text_type: string
            The type of the text provided (i.e., 'document', 'topic')
        stopwords_removal : boolean
            This parameter specify whether to filter the stopwords
        stemming : boolean
            This parameter specify whether to stem each word
        lemmatization : boolean
            This parameter specify whether to apply the lemmatization process (only for English language)
        Returns
        -------
        bows : list
            List of bag of words to return.
        """

        CUSTOM_FILTERS = [lambda x: x.lower(), strip_tags, strip_punctuation, strip_multiple_whitespaces, strip_numeric, strip_short]

        preprocessed_text = preprocess_string(text, CUSTOM_FILTERS)

        # ic_logger = # IcLogger(print_status=False)

        # if verbose:
        #     ic_logger.set_status(True)

        # ic_logger.log(preprocessed_text)

        # init stopwords removal and stemmer toolkits
        stopwords_nltk = stopwords.words(self.language)
        snow_stemmer = SnowballStemmer(language=self.language)
        # init WordNet lemmatizer (only for language="english")
        lemmatizer = WordNetLemmatizer()
        bows = []
        stem_bows = None
        lemm_bows = None

        if stopwords_removal:
            # remove (filter) every stop word contained in stopwords_nltk for the specified language (default: "english")
            bows = [word for word in preprocessed_text if word.lower() not in stopwords_nltk]

        if stemming:
            # stem's of each word
            stem_bows = []
            if text_type == 'topic':
                self.map_stemmed_bow_topic_to_not_stemmed = {}
            elif text_type == 'document':
                self.map_stemmed_bow_doc_to_not_stemmed = {}
            for word in bows:
                stemmed_term = snow_stemmer.stem(word)
                stem_bows.append(stemmed_term)
                if text_type == 'topic':
                    if stemmed_term in self.map_stemmed_bow_topic_to_not_stemmed:
                        self.map_stemmed_bow_topic_to_not_stemmed[stemmed_term].append(word)
                    else:
                        self.map_stemmed_bow_topic_to_not_stemmed[stemmed_term] = [word]
                elif text_type == 'document':
                    if stemmed_term in self.map_stemmed_bow_doc_to_not_stemmed:
                        self.map_stemmed_bow_doc_to_not_stemmed[stemmed_term].append(word)
                    else:
                        self.map_stemmed_bow_doc_to_not_stemmed[stemmed_term] = [word]
            bows = [stem_bow for stem_bow in stem_bows]

        if self.language == "english" and lemmatization:
            # get the corresponding lemma of each word
            lemm_bows = [lemmatizer.lemmatize(word) for word in bows]
            # merge "bows" list with "lemm_bows"
            bows = bows + lemm_bows

        # ic_logger.log(bows)

        return bows

    def custom_tokenizer(self, text):
        bow = self.get_bag_of_words(text, text_type="other")
        return bow

    def gen_tfidf_map(self, verbose=False):
        """Return the tf-idf matrix containing the tf-idf score of each word for each document in the given corpus.
        Returns
        -------
        df_tfidfvect : Pandas DataFrame
            Pandas DataFrame containing the tf-idf score of each word for each document in the given corpus.
        """

        # ic_logger = # IcLogger(print_status=False)

        # if verbose:
        #     ic_logger.set_status(True)

        # init sklearn TfidfVectorizer
        tfidfvectorizer = TfidfVectorizer(analyzer='word', tokenizer=self.custom_tokenizer)

        corpus_text = [doc['text'] for doc in self.corpus]
        tfidf_wm = tfidfvectorizer.fit_transform(corpus_text)
        # ic_logger.log(tfidf_wm)
        tfidf_tokens = tfidfvectorizer.get_feature_names_out()
        # create pandas DataFrame from tfidf matrix
        df_tfidfvect = pd.DataFrame(data=tfidf_wm.toarray(), index=[doc['document_id'] for doc in self.corpus],
                                    columns=tfidf_tokens)

        # ic_logger.log(tfidf_tokens)
        # ic_logger.log(df_tfidfvect)

        self.df_tfidf = df_tfidfvect

        return df_tfidfvect

    def topic_doc_matching_words(self, verbose=False):
        """Return the set of matching words for the given topic (query) and document.
        Returns
        -------
        matching_words : set
            Set of matching words for the given topic (query) and document.
        """
        # ic_logger = # IcLogger(print_status=False)

        # if verbose:
        #     ic_logger.set_status(True)

        matching_words = set()

        doc_lowercase = self.doc["text"].lower()

        for t_i in self.bow_topic:
            if t_i.lower() in doc_lowercase:
                matching_words.add(t_i)

        return matching_words

    def get_top_k_matching_words(self, docno, verbose=False):
        """Return the top-k matching words for the given document identifier (docno).
        Parameters
        ----------
        docno : string
            The document identifier with respect to we want to compute the top-k matching words.
        Returns
        -------
        top_k_matching_words : list
            List of the top-k matching words.
        """

        # ic_logger = # IcLogger(print_status=False)

        # if verbose:
        #     ic_logger.set_status(True)

        # list of the top-k matching words
        top_k_matching_words = []

        processed_words = []

        for w in self.matching_bow:
            c_w = None
            if w in self.df_tfidf.columns:
                c_w = w
                if c_w is not None:
                    c_words_not_stemmed = []
                    c_words_not_stemmed_topic = []
                    if c_w in self.map_stemmed_bow_doc_to_not_stemmed:
                        c_words_not_stemmed = self.map_stemmed_bow_doc_to_not_stemmed[c_w]
                    if c_w in self.map_stemmed_bow_topic_to_not_stemmed:
                        c_words_not_stemmed_topic = self.map_stemmed_bow_topic_to_not_stemmed[c_w]
                    for c_w_not_stemmed in c_words_not_stemmed:
                        if c_w_not_stemmed not in processed_words:
                            top_k_matching_words.append((c_w_not_stemmed, round(self.df_tfidf._get_value(docno, c_w), 2)))
                            processed_words.append(c_w_not_stemmed)
                    for c_w_not_stemmed_topic in c_words_not_stemmed_topic:
                        if c_w_not_stemmed_topic not in processed_words:
                            top_k_matching_words.append((c_w_not_stemmed_topic, round(self.df_tfidf._get_value(docno, c_w), 2)))
                            processed_words.append(c_w_not_stemmed_topic)

        # ic_logger.log(top_k_matching_words)

        # sort list with key
        top_k_matching_words.sort(key=itemgetter(1), reverse=True)

        # keeps only the top-k matching words
        top_k_matching_words = top_k_matching_words[:self.k]

        # ic_logger.log(top_k_matching_words)

        return top_k_matching_words



    def gen_map_bow(self):
        """Generate and save a dict that acts as a map for each stemmed word to the set of corresponding (not-stemmed) words.
        """
        dict_stemmed_not_stemmed = {}
        snow_stemmer = SnowballStemmer(language=self.language)
        for bow_i_stemmed in self.bow_doc_stemmed:
            dict_stemmed_not_stemmed[bow_i_stemmed] = set()
            for bow_i_not_stemmed in self.bow_doc:
                if snow_stemmer.stem(bow_i_not_stemmed) == bow_i_stemmed:
                    dict_stemmed_not_stemmed[bow_i_stemmed].add(bow_i_not_stemmed)

        dict_stemmed_not_stemmed_topic = {}
        for bow_topic_i_stemmed in self.bow_topic:
            dict_stemmed_not_stemmed_topic[bow_topic_i_stemmed] = set()
            for bow_topic_i_not_stemmed in self.bow_topic_not_stemmed:
                if snow_stemmer.stem(bow_topic_i_not_stemmed) == bow_topic_i_stemmed:
                    dict_stemmed_not_stemmed_topic[bow_topic_i_stemmed].add(bow_topic_i_not_stemmed)

        self.map_stemmed_bow_doc_to_not_stemmed = copy.deepcopy(dict_stemmed_not_stemmed)
        self.map_stemmed_bow_topic_to_not_stemmed = copy.deepcopy(dict_stemmed_not_stemmed_topic)

    def get_words_to_highlight(self, verbose=False):
        """Return the top-k matching words to highlight for the given topic (query) and document.
        Returns
        -------
        top_k_matching_words : list
            List of the top-k matching words to highlight.
        """

        # ic_logger = # IcLogger(print_status=False)

        # if verbose:
        #     ic_logger.set_status(True)

        # list of the top-k matching words
        top_k_matching_words = []

        # topic data
        title = self.topic["title"]
        desc = self.topic["description"]
        topic_joint_text = ' '.join([title, desc])

        # document data
        docno = self.doc['document_id']
        doc_text = self.doc['text']

        # compute bow for topic and document (for the document compute bow in both cases: (not) stemmed)
        self.bow_topic = self.get_bag_of_words(topic_joint_text, text_type="topic", stemming=True)
        self.bow_topic_not_stemmed = self.get_bag_of_words(topic_joint_text, text_type="topic", stemming=False)
        self.bow_doc = self.get_bag_of_words(doc_text, text_type="document", stemming=False)
        self.bow_doc_stemmed = self.get_bag_of_words(doc_text, text_type="document", stemming=True)

        # get matching words stemmed
        self.matching_bow_stemmed = self.topic_doc_matching_words()
        self.matching_bow = self.matching_bow_stemmed

        # print "matching_words" in case verbose=True
        # ic_logger.log(self.matching_bow_stemmed)

        # generate tfidf map
        self.gen_tfidf_map()

        # compute top-k matching words sorted (descending) according to tfidf score
        top_k_matching_words = self.get_top_k_matching_words(docno)

        return top_k_matching_words

    @staticmethod
    def demo():
        """
        This function provides a demonstration of the QueryDocMatcher module.
        After invoking this function, the top-k matching words between a toy query (topic) and document are computed.
        Finally, the list of top-k matching words sorted by tf-idf score is printed.
        """

        # Define a topic
        topic = {
            "title": "Cities the First Lady visited on official business.",
            "description": "What cities other than Washington D.C. has the First Lady visited on official business (i.e., accompanying the President or addressing audiences/attending events)?"
        }

        # Log the topic
        # IcLogger.print(topic)

        # Define a corpus

        corpus = [{'docno': 'DOC1', 'text': 'The sky is blue, actually very blue.'},
                  {'docno': 'DOC2', 'text': 'The sun is bright and blue in Washington D.C., New York city and other cities. New York citizens are over eight million.'}]

        # Iterate over the corpus' documents
        for document in corpus:

            # Log the document
            # # IcLogger.print(document)

            tfidf_matcher = QueryDocMatcher(topic, document, corpus)

            # Compute the top-k matching words
            top_k_matching_words = tfidf_matcher.get_words_to_highlight()

            # Log the top-k matching_words
            # # IcLogger.print(top_k_matching_words)