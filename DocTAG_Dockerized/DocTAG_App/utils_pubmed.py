from metapub import *


def insert_articles_of_PUBMED(id_report_original):
    fetch = PubMedFetcher()
    json_val = {}
    try:
        # article = fetch.article_by_pmid(id_report_original)
        article = fetch.article_by_pmid(int(id_report_original))
    except Exception as e:
        json_val = {'error':'an error occurred, the PMID is: ' +str(id_report_original)+'. Maybe it is invalid. '}
    else:
        title = article.title
        abstract = article.abstract
        journal = article.journal
        volume = article.volume
        year = article.year
        authors = article.authors
        json_val = {}
        json_val['title'] = title
        json_val['abstract'] = abstract
        json_val['journal'] = journal
        json_val['volume'] = volume
        json_val['year'] = year
        json_val['authors'] = authors
    finally:
        return json_val
