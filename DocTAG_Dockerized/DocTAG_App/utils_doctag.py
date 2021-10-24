import psycopg2
import re
import json
from DocTAG_App.models import *
import os
import numpy
import hashlib
import xml.etree.ElementTree as ET
from django.db import connection
import pandas as pd
import xml.etree.ElementTree as ElementTree
from datetime import date
from psycopg2.extensions import register_adapter, AsIs
def addapt_numpy_float64(numpy_float64):
    return AsIs(numpy_float64)
def addapt_numpy_int64(numpy_int64):
    return AsIs(numpy_int64)
register_adapter(numpy.float64, addapt_numpy_float64)
register_adapter(numpy.int64, addapt_numpy_int64)
from DocTAG_App.utils import *
from django.db.models import Count
from django.db import transaction
import datetime
from lxml import etree


def elaborate_TREC_topic_files(arr_to_ret,f,action=None):
    nums = []
    try:
        print(f)
        print(type(f))

        # with open(topic, 'r') as f:  # Reading file
        lines = f.readlines()
        print(lines)
        narr_string = ''
        desc_string = ''
        title_string = ''
        num = ''
        cur_tag = ''
        for line in lines:
            ind = lines.index(line)
            line = line.decode('utf-8')
            if line != '\n':

                if line.endswith('\n'):
                    line = line.replace('\n','')
                if line.startswith('</top>'):
                    if num == '':

                        return "topic at index " + str(ind) + " has not a topic number"

                    if action is None:
                        tops = [str(tup[0]) for tup in arr_to_ret]
                        if str(num) in tops:
                            UseCase.objects.create(name=str(num),narrative = narr_string,description = desc_string,title = title_string)
                    # print(num)
                    # print(title_string)
                    # print(desc_string)
                    # print(narr_string)
                    narr_string = ''
                    desc_string = ''
                    cur_tag = ''
                    title_string = ''
                    num = ''

                elif line.startswith('<top>'):
                    cur_tag = 'top'
                elif line.startswith('<num>'):
                    cur_tag = 'num'
                    num = str(re.findall(r'\d+', line)[0])
                    nums.append(str(num))
                elif line.startswith('<title'):
                    cur_tag = 'title'
                elif line.startswith('<desc'):
                    cur_tag = 'desc'
                    line = line.replace('Description:','')
                elif line.startswith('<narr'):
                    cur_tag = 'narr'
                    line = line.replace('Narrative:', '')
                line = re.sub("<.*>", "", line)
            if cur_tag == 'narr':
                narr_string = narr_string + ' ' + line
                narr_string = narr_string.strip()
            elif cur_tag == 'title':
                title_string = title_string + ' ' + line
                title_string = title_string.strip()
            elif cur_tag == 'desc':
                desc_string = desc_string + ' ' + line
                desc_string = desc_string.strip()


        return nums
    except Exception as e:
        print(e)
        return e


def process_topic_json_file(arr_to_ret,f):
            # with open(topic, 'r') as f:
    data = json.load(f)
    for el in data['topics']:
        topic_id = el['topic_id']
        if 'title' in el.keys():
            title = el['title']
        else:
            title = None
        if 'description' in el.keys():
            description = el['description']
        else:
            description = None
        if 'narrative' in el.keys():
            narrative = el['narrative']
        else:
            narrative = None

        topics = [str(tup[0]) for tup in arr_to_ret]
        if str(topic_id) in topics:
            UseCase.objects.create(name = str(topic_id),title = title, description = description,
                               narrative = narrative)



def process_topic_csv_file(arr_to_ret,file):
    df = pd.read_csv(file)
    df = df.where(pd.notnull(df), None)
    df = df.reset_index(drop=True)
    count_rows = df.shape[0]
    for i in range(count_rows):
        topic_id = str(df.loc[i, 'topic_id'])
        title = str(df.loc[i, 'title'])
        description = str(df.loc[i, 'description'])
        narrative = str(df.loc[i, 'narrative'])
        topics = [str(tup[0]) for tup in arr_to_ret]
        if str(topic_id) in topics:
            UseCase.objects.create(name=str(topic_id), title=title, description=description,
                                   narrative=narrative)


def elaborate_runs(runs):
    arr_to_ret = []
    for run in runs:
        if run.name.endswith('json'):
            arr = elaborate_runs_json_files(run)
            arr_to_ret.extend(arr)
        if run.name.endswith('csv'):
            arr = elaborate_runs_csv_files(run)
            arr_to_ret.extend(arr)
        if run.name.endswith('txt'):
            arr = elaborate_runs_TREC_files(run)
            if arr != False:
                arr_to_ret.extend(arr)
            else:
                arr = elaborate_runs_txt_files(run)
                arr_to_ret.extend(arr)
    return arr_to_ret



def elaborate_runs_TREC_files(run):

    """Elaborates the runs TREC files and returns an array of tuples where the first element is the topic while
    the second one is the document"""

    arr_to_ret = []
    # for run in runs:
    # with open(run,'r') as f:
    lines = run.readlines()
    for line in lines:
        line = line.decode('utf-8')
        vals = line.split()
        if len(vals) == 2:
            topic_id = vals[0]
            document_id = vals[1]
            language = 'english'
        elif len(vals) == 3:
            topic_id = vals[0]
            document_id = vals[1]
            language = vals[2]
        else:
            topic_id = vals[0]
            document_id = vals[2]
            language = 'english'


        arr_to_ret.append((topic_id,document_id,language))
    return arr_to_ret


def elaborate_runs_txt_files(run):

    """Elaborates the runs txt files and returns an array of tuples where the first element is the topic while the
    second one is the document"""

    arr_to_ret = []
    # for run in runs:
    with open(run,'r') as f:
        lines = f.readlines()
        for line in lines:
            line = line.decode('utf-8')
            vals = line.split(' ')
            topic_id = vals[0]
            document_id = vals[1]
            arr_to_ret.append((topic_id,document_id))
    return arr_to_ret


def elaborate_runs_csv_files(run):

    """Elaborates the runs csv files and returns an array of tuples where the first element is the topic while the
    second one is the document"""

    arr_to_ret = []
    # for run in runs:
    df = pd.read_csv(run)
    count_rows = df.shape[0]
    for i in range(count_rows):
        topic_id = str(df.loc[i, 'topic_id'])
        document_id = str(df.loc[i, 'document_id'])
        if 'language' in df:
            arr_to_ret.append((topic_id,document_id,str(df.loc[i, 'language'])))
        else:
            arr_to_ret.append((topic_id, document_id,'english'))
    return arr_to_ret


def elaborate_runs_json_files(run):

    """Elaborates the runs json files and returns an array of tuples where the first element is the topic while the
    second one is the document"""

    arr_to_ret = []
    # for run in runs:
    # with open(run,'r') as f:
    data = json.load(run)
    for el in data['run']:
        topic_id = el['topic_id']
        docs = el['documents']
        for d in docs:
            if isinstance(d,dict):
                if 'language' in d.keys() and 'document_id' in d.keys():
                    arr_to_ret.append((topic_id,d['document_id'],d['language']))
            else:
                arr_to_ret.append((topic_id,d,'english'))

    return arr_to_ret


# def find_docs_in_TREC_collection(arr_tuples,docc):
#
#     """This function takes the collection and the runs and look for the runs' docs int he collection: when the docs are
#     found, these are inserted in the db"""
#
#     # build an array with the ids of the docs which appear in the array of tuples.
#     arr_ids = [str(i[1]) for i in arr_tuples]
#     arr_found = []
#     # process the collection of docs
#     if docc.name.endswith('.txt'):
#         print(docc)
#         with open(docc, 'r') as f:   # Reading file
#             xml = f.read()
#
#         xml = '<ROOT>' + xml + '</ROOT>'   # Let's add a root tag
#
#         root = ET.fromstring(xml)
#         print(xml)
#         print(root)
#         # Simple loop through each document
#         for doc in root.iter('DOC'):
#             print(doc)
#             doc_no = doc.find('DOCNO')
#             print(doc_no.tag, doc_no.text)
#             if str(doc_no.text) in arr_ids:
#                 arr_found.append(str(doc_no.text))
#                 document_id = doc.find('DOCID').text
#                 json_doc = {}
#                 json_doc['id'] = document_id
#                 json_doc['no'] = doc_no
#                 json_doc['article'] = doc
#                 language = 'english'
#                 institute = 'default'
#                 batch = 1
#                 insertion_time = str(date.today())
#                 Report.objects.create(id_report = document_id,language = language, report_json = json_doc,batch = batch, insertion_date = insertion_time,institute = institute)
#
#         data = {}
#         data['fields'] = ['id','no']
#         data['fields_to_ann'] = ['article']
#         data['all_fields'] = ['id','no','article']
#         version = get_version()
#         workpath = os.path.dirname(os.path.abspath(__file__))  # Returns the Path your .py file is in
#         version_new = int(version) + 1
#         filename = 'fields' + str(version_new)
#         with open(os.path.join(workpath, './data/' + filename + '.json'), 'w') as outfile:
#             json.dump(data, outfile)



def find_docs_in_json_collection(arr_tuples,file,batch=None):

    """This function takes the json collection and the runs and look for the runs' docs in the collection: when the docs are
       found, these are inserted in the db"""

    # build an array with the ids of the docs which appear in the array of tuples.
    arr_ids = [str(i[1]) for i in arr_tuples]
    arr_tops = [str(i[0]) for i in arr_tuples]
    arr_found = []
    cursor = connection.cursor()
    tup_topic_batch_list = []
    for t in arr_tops:
        if batch == 'batch':

                cursor.execute("SELECT MAX(batch) FROM report as r inner join topic_has_document as t on t.id_report = r.id_report and t.language = r.language where t.name = %s",[str(t)])
                ans = cursor.fetchone()[0]
                b = int(ans) +1
        else:
            b = 1
        tup_topic_batch_list.append((str(t), b))

    # process the collection of docs
    if isinstance(file, str):
        workpath = os.path.dirname(os.path.abspath(__file__))  # Returns the Path your .py file is in
        rep_name = os.path.join(workpath, 'static/tmp/' + file)
        file = rep_name
    else:
        rep_name = file.name
    if rep_name.endswith('.json'):
        data = json.load(file)
        documents = data['collection']
        for document in documents:
            if 'language' in document.keys():
                language = document['language']
            else:
                language = 'english'
            institute = 'default'

            insertion_time = str(date.today())
            id_report = document['document_id']
            report_json = {}
            for k in document.keys():

                filtered_characters = list(s for s in document[k] if s.isprintable())
                report_json[k] = ''.join(filtered_characters)

            if str(id_report) in arr_ids:
                arr_found.append(id_report)
                Report.objects.create(id_report = id_report,language = language, report_json = report_json,batch = b, insertion_date = insertion_time,institute = institute)
    #     if len(arr_ids) == len(arr_found):
    #         return True
    # return list(set(arr_ids) - set(arr_found))


from datetime import date
import time
from DocTAG_App.utils_pubmed import *
from django.db import connection

def find_docs_in_json_pubmed_collection(arr_tuples,file,batch = None):

    """This function takes the json collection and the runs and look for the runs' docs in the collection: when the docs are
       found, these are inserted in the db"""

    # build an array with the ids of the docs which appear in the array of tuples.
    arr_ids = [str(i[1]) for i in arr_tuples]
    arr_tops = [str(i[0]) for i in arr_tuples]
    arr_found = []
    # process the collection of docs
    cursor = connection.cursor()
    tup_topic_batch_list = []
    for t in arr_tops:
        if batch == 'batch':

                cursor.execute("SELECT MAX(batch) FROM report as r inner join topic_has_document as t on t.id_report = r.id_report and t.language = r.language where t.name = %s and institute = %s",[str(t),'PUBMED'])
                ans = cursor.fetchone()[0]
                b = int(ans) +1
        else:
            b = 1
        tup_topic_batch_list.append((str(t), b))
    today = str(date.today())
    pubmed_ids = []
    languages = []
    if file.name.endswith('json'):
        d = json.load(file)
        pubmed_ids = d['pubmed_ids']
    elif file.name.endswith('csv'):
        df = pd.read_csv(file)
        pubmed_ids = df.document_id()
        if 'language' in df:
            languages = df.language()
    elif file.name.endseith('txt'):
        pubmed_lines = file.readlines()
        for line in pubmed_lines:
            pubmed_ids.append(line.split()[0])
            if len(line.split()) > 1:
                languages.append(line.split()[1])

    i = 0
    var = True

    while var:
        st = time.time()
        for count in range(3):
            id_report_original = str(pubmed_ids[i])

            if len(languages) > 0:
                language = languages[i]
            id_report = 'PUBMED_' + str(id_report_original)
            if id_report in arr_ids:

                report_json = insert_articles_of_PUBMED(id_report_original)
                if 'error' in report_json.keys():
                    return report_json
                report_json = json.dumps(report_json)
                # Duplicates are not inserted
                cursor = connection.cursor()
                cursor.execute("SELECT * FROM report WHERE id_report = %s AND language = %s;",
                               (str(id_report), language))
                ans = cursor.fetchall()
                if len(ans) == 0:
                    cursor.execute(
                        "INSERT INTO report (id_report,report_json,institute,language,batch,insertion_date) VALUES (%s,%s,%s,%s,%s,%s);",
                        (str(id_report), report_json, 'PUBMED', language, b, today))

                i = i + 1
                if len(pubmed_ids) == i:
                    var = False
                    break

            try:
                time.sleep(1 - (time.time() - st))
            except Exception as e:
                print(e)
                pass


def find_docs_in_csv_collection(arr_tuples,file,batch = None):

    """This function takes the collection and the runs and look for the runs' docs int he collection: when the docs are
       found, these are inserted in the db"""

    # build an array with the ids of the docs which appear in the array of tuples.
    arr_ids = [str(i[1]) for i in arr_tuples]
    arr_found = []
    # for file in docs:
    cursor = connection.cursor()
    if batch == 'batch':
        cursor.execute("SELECT MAX(batch) FROM report")
        ans = cursor.fetchone()[0]
        b = int(ans) +1
    else:
        b = 1
    if isinstance(file, str):
        workpath = os.path.dirname(os.path.abspath(__file__))  # Returns the Path your .py file is in
        rep_name = os.path.join(workpath, 'static/tmp/' + file)
    else:
        rep_name = file.name
    if rep_name.endswith('.csv'):
        df = pd.read_csv(rep_name)
        df = df.where(pd.notnull(df), None)
        df = df.reset_index(drop=True)

        institute = 'default'
        insertion_time = str(date.today())
        ids = list(df.document_id.unique().str)
        if bool(set(ids) & set(arr_ids)):
            for col in df:
                if col != 'document_id':
                    col.replace(' ', '_')
            count_rows = df.shape[0]
            for i in range(count_rows):
                id_report = str(df.loc[i, 'document_id'])

                if 'language' in df:
                    language = str(df.loc[i, 'language'])
                else:
                    language = 'english'

                if id_report in arr_ids:
                    arr_found.append(id_report)
                    json_rep = {}
                    for col in df:
                        if df.loc[i, col] is not None:
                            col1 = col.replace(' ', '_')
                            testo = str(df.loc[i, col])
                            filtered_characters = list(s for s in testo if s.isprintable())
                            testo = ''.join(filtered_characters)
                            json_rep[col1] = testo
                    Report.objects.create(id_report = id_report,language = language,institute = institute,report_json = json_rep,batch = b,insertion_date = insertion_time)
    #     if len(arr_ids) == len(arr_found):
    #         return True
    # return list(set(arr_ids) - set(arr_found))


def process_TREC_and_txt_runs(run):

    """This method handle the associations between document and topioc: file formatted as TREC"""

    language = 'english'
    print(run)
    print(type(run))

    # with open(topic, 'r') as f:  # Reading file
    lines = run.readlines()
    print(lines)
    for line in lines:
        line = line.decode('utf-8')
        elements = line.split()
        if len(elements) > 2:
            topic_id = str(elements[0])
            document_id = str(elements[2])
        elif len(elements) == 2:
            topic_id = str(elements[0])
            document_id = str(elements[1])
        elif len(elements) == 3:
            topic_id = str(elements[0])
            document_id = str(elements[1])
            language = str(elements[2])
        else:
            return True
        if UseCase.objects.filter(name=topic_id).exists() and Report.objects.filter(id_report = document_id).exists() and not TopicHasDocument.objects.filter(topic_id=topic_id, document_id=document_id,language = language).exists():
            TopicHasDocument.objects.create(topic_id=topic_id,document_id=document_id,language = language)
        else:
            return topic_id,document_id

    return True


def process_csv_runs(file):

    """This method handle the associations between document and topioc: file formatted as csv"""

    language = 'english'
    if file.name.endswith('.csv'):
        df = pd.read_csv(file)
        df = df.where(pd.notnull(df), None)
        df = df.reset_index(drop=True)
        count_rows = df.shape[0]
        for i in range(count_rows):
            document_id = str(df.loc[i,'document_id'])
            topic_id = str(df.loc[i,'topic_id'])
            if 'language' in df:
                language = str(df.loc[i,'language'])
            if UseCase.objects.filter(name=topic_id).exists() and Report.objects.filter(id_report=document_id,language = language).exists() and not TopicHasDocument.objects.filter(topic_id=topic_id, document_id=document_id,language = language).exists():
                TopicHasDocument.objects.create(topic_id=topic_id, document_id=document_id,language = language)
            else:
                return topic_id, document_id
    return True


def process_json_runs(file):

    """This function takes the json collection and the runs and look for the runs' docs in the collection: when the docs are
       found, these are inserted in the db"""

    language = 'english'
    if file.name.endswith('.json'):
        data = json.load(file)

        for el in data:

            document_ids = el['documents']
            topic_id = el['topic_id']
            for document_id in document_ids:
                if isinstance(document_id,dict):
                    if 'language' in document_id.keys():
                        language = document_id['language']
                    document_id = document_id['document_id']
                if UseCase.objects.filter(name=topic_id).exists() and Report.objects.filter(id_report=document_id).exists() and not TopicHasDocument.objects.filter(topic_id=topic_id, document_id=document_id,language = language).exists():
                    TopicHasDocument.objects.create(topic_id=topic_id, document_id=document_id, language= language)
                else:
                    return topic_id, document_id
    return True

from DocTAG_App.matcher.matcher import *


def get_bag_of_words(text, stopwords_removal=True, stemming=True, lemmatization=False, verbose=False):
    """Return the bag of words for the given text according to the parameters specified (stopwords_removal, stemming and lemmatization).
    Parameters
    ----------
    text : string
        The text string from which we extract the bag of words
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

    CUSTOM_FILTERS = [lambda x: x.lower(), strip_tags, strip_punctuation, strip_multiple_whitespaces, strip_numeric,
                      strip_short]

    language = 'english'

    preprocessed_text = preprocess_string(text, CUSTOM_FILTERS)

    ic_logger = IcLogger(print_status=False)

    if verbose:
        ic_logger.set_status(True)

    ic_logger.log(preprocessed_text)

    # init stopwords removal and stemmer toolkits
    stopwords_nltk = stopwords.words(language)
    snow_stemmer = SnowballStemmer(language=language)
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
        stem_bows = [snow_stemmer.stem(word) for word in bows]

        bows = [stem_bow for stem_bow in stem_bows]

    if language == "english" and lemmatization:
        # get the corresponding lemma of each word
        lemm_bows = [lemmatizer.lemmatize(word) for word in bows]
        # merge "bows" list with "lemm_bows"
        bows = bows + lemm_bows

    ic_logger.log(bows)

    return bows


def custom_tokenizer(text):
    bow = get_bag_of_words(text)

    return bow
def gen_tfidf_map(corpus):
    """Return the tf-idf matrix containing the tf-idf score of each word for each document in the given corpus.
    Returns
    -------
    df_tfidfvect : Pandas DataFrame
        Pandas DataFrame containing the tf-idf score of each word for each document in the given corpus.
    """

    # init sklearn TfidfVectorizer
    tfidfvectorizer = TfidfVectorizer(analyzer='word', tokenizer=custom_tokenizer, stop_words='english')
    # tfidfvectorizer = TfidfVectorizer(analyzer='word', stop_words=self.language)

    tfidf_wm = tfidfvectorizer.fit_transform([doc['text'] for doc in corpus])
    tfidf_tokens = tfidfvectorizer.get_feature_names_out()
    # create pandas DataFrame from tfidf matrix
    df_tfidfvect = pd.DataFrame(data=tfidf_wm.toarray(), index=[doc['document_id'] for doc in corpus],
                                columns=tfidf_tokens)


    return df_tfidfvect