from DocTAG_App.utils import *
from psycopg2.extensions import register_adapter, AsIs
def addapt_numpy_float64(numpy_float64):
    return AsIs(numpy_float64)
def addapt_numpy_int64(numpy_int64):
    return AsIs(numpy_int64)
register_adapter(numpy.float64, addapt_numpy_float64)
register_adapter(numpy.int64, addapt_numpy_int64)
from collections import defaultdict
from DocTAG_App.utils_pubmed import *
import os.path
from DocTAG_App.utils_doctag import *

"""This .py file includes the methods needed to configure MedTAG and update its configuration"""


def check_file(reports,pubmedfiles, labels, concepts, jsonDisp, jsonAnn, username, password,topics,runs,tf_idf):

    """This method checks whether the inserted files complies with the requirements"""

    json_resp = {}
    json_keys = []
    usecases_list = []
    docs = []
    tops = []
    topics_ids = []
    documents_ids = []
    languages = []

    json_resp['general_message'] = ''
    json_resp['username_message'] = ''
    json_resp['report_message'] = ''
    json_resp['pubmed_message'] = ''
    json_resp['concept_message'] = ''
    json_resp['label_message'] = ''
    json_resp['topic_message'] = ''
    json_resp['tfidf_message'] = ''
    json_resp['runs_message'] = ''
    json_resp['fields_message'] = ''
    json_resp['keys'] = json_keys

    #added 2/11
    if (len(labels) == 0 and len(concepts) == 0) and len(topics) == 0 and (len(reports) == 0 and len(pubmedfiles) == 0) and len(runs) == 0:
        json_resp[
            'general_message'] = 'ERROR - You must provide at least four files: the lables (or concepts), the topics, the runs and the reports.'
    # if len(jsonAnn) == 0:
    #     json_resp[
    #         'general_message'] = 'ERROR - You must provide at least one field to annotate.'
    elif len(reports) == 0 and len(pubmedfiles) == 0:
        json_resp['general_message'] = 'ERROR - You must provide a file with one or more reports or one or more pubmed files.'
    elif len(pubmedfiles) > 0 and len(concepts) == 0 and len(labels) == 0:
        json_resp['general_message'] = 'PUBMED - only mentions allowed.'

    try:
        try:
            cursor = connection.cursor()
            cursor.execute('SELECT * FROM public.user WHERE username = %s', (str(username),))
            ans = cursor.fetchall()
            # Error on username and password: duplicated username or missing
            if len(ans) > 0 or username == 'Test':
                json_resp['username_message'] = 'USERNAME - The username you selected is already taken. Choose another one.'
            if (username == ''):
                json_resp['username_message'] = 'USERNAME - Please, provide a username.'
            if password == '' and username == '':
                json_resp['username_message'] = 'USERNAME - Please, provide a username and a password.'

        except (Exception, psycopg2.Error) as e:
            print(e)
            json_resp[
                'username_message'] = 'An error occurred handling the username and the password. Please, insert them again.'
            pass

        else:
            if json_resp['username_message'] == '':
                json_resp['username_message'] = 'Ok'

        # This is necessary to collect the fields to annotate and display
        fields = []
        fields_to_ann = []
        jsondisp = ''.join(jsonDisp)
        jsonann = ''.join(jsonAnn)
        jsondisp = jsondisp.split(',')
        jsonann = jsonann.split(',')

        for el in jsondisp:
            if len(el) > 0:
                fields.append(el)
        for el in jsonann:
            if len(el) > 0:
                fields_to_ann.append(el)

        if not tf_idf.isdigit():
            json_resp['tfidf_message'] = 'TF-IDF - the value must include only digits'
        if json_resp['tfidf_message'] == '':
            json_resp['tfidf_message'] = 'Ok'
        # Error if 0 report files are added
        if len(reports) == 0 and len(pubmedfiles) == 0:
            json_resp['report_message'] = 'REPORTS FILES - You must provide at least one file containing reports or at least one file containing PubMED IDs before checking'
            json_resp['pubmed_message'] = 'PUBMED FILES - You must provide at least one file containing reports or at least one file containing PubMED IDs before checking'
        if len(topics) == 0:
            json_resp['topic_message'] = 'TOPIC FILES - You must provide at least one file containing topics'
        if len(runs) == 0:
            json_resp['runs_message'] = 'RUNS FILES - You must provide at least one file containing runs'

        # docs_tot = []
        for j in range(len(reports)):
            r = decompress_files([reports[j]])
            for i in range(len(r)):

                if isinstance(r[i], str):
                    rep_name = r[i]
                    workpath = os.path.dirname(os.path.abspath(__file__))  # Returns the Path your .py file is in
                    r[i] = os.path.join(workpath, 'static/tmp/' + r[i])
                else:
                    rep_name = r[i].name
                if not rep_name.endswith('csv') and not rep_name.endswith('json'):
                    json_resp['report_message'] = 'DOCUMENTS FILE - ' + rep_name + ' - The file must be .csv and .json and .txt and .Z and .zip'
                    break

                if rep_name.endswith('.csv'):
                    try:
                        df = pd.read_csv(r[i])
                        df = df.where(pd.notnull(df), None)
                        df = df.reset_index(drop=True)  # Useful if the csv includes only commas
                    except Exception as e:
                        print(e)
                        json_resp['report_message'] = 'DOCUMENTS FILE - ' + rep_name + ' - An error occurred while parsing the csv. Check if it is well formatted. Check if it contains as many columns as they are declared in the header.'
                        pass

                    else:
                        # check if colunns are allowed and without duplicates
                        cols = list(df.columns)
                        list_db_col = ['document_id','language']
                        list_not_db_col = []

                        missing = False
                        for el in list_db_col:
                            if el not in cols and el == 'document_id':
                                json_resp['report_message'] = 'DOCUMENTS FILE - ' + rep_name + ' - The column: ' + el + ' is missing, please add it.'
                                missing = True
                                break
                        if missing:
                            break


                        for id in list(df.document_id.unique()):
                            if not str(id) in documents_ids:
                            #     json_resp['report_message'] = 'WARNING DOCUMENTS FILE - ' + rep_name + ' - The id: ' + str(id) + ' is duplicated. The duplicates are ignored.'
                            # else:
                                documents_ids.append(str(id))

                        for el in cols:
                            if el not in list_db_col:
                                list_not_db_col.append(el)

                        for el in df.document_id:
                            if el.lower().startswith('pubmed_'):
                                json_resp['report_message'] = 'DOCUMENTS FILE - ' + rep_name + ' - reports\' ids can not start with "PUBMED_", please, change the name'

                        # if 0 optional columns are added
                        if len(list_not_db_col) == 0:
                            json_resp['report_message'] = 'DOCUMENTS FILE - ' + rep_name + ' - You must provide at least one column other than the documents\' ids'
                            break

                        # Check if the csv is empty with 0 rows
                        if df.shape[0] == 0:
                            json_resp['report_message'] = 'DOCUMENTS FILE - ' + rep_name + ' -  You must provide at least a report.'
                            break
                        else:
                            # check if columns id_report and language have no duplicates
                            df_dup = df[df.duplicated(subset=['document_id'], keep=False)]
                            if 'language' in df:
                                df_dup = df[df.duplicated(subset=['document_id','language'], keep=False)]
                            if df_dup.shape[0] > 0:
                                json_resp['report_message'] = 'WARNING DOCUMENTS FILE - ' + rep_name + ' - The rows: ' + str(
                                    df_dup.index.to_list()) + ' are duplicated. The duplicates are ignored.'

                        # Check if the optional rows are empty for one or more reports.
                        exit = False
                        # docs_tot.extend(list(df.document_id.unique()))
                        for ind in range(df.shape[0]):

                            count_both = 0
                            not_none_cols = []
                            isnone = True
                            for el in list_not_db_col:
                                if df.loc[ind, el] is not None:
                                    isnone = False
                                    not_none_cols.append(el)

                            for el in not_none_cols:
                                if el not in jsonann and el not in jsondisp:
                                    count_both = count_both + 1

                            if count_both == len(not_none_cols):
                                json_resp['fields_message'] = 'WARNING REPORT FIELDS TO DISPLAY AND ANNOTATE - ' + rep_name + ' -  With this configuration the report at the row: ' + str(
                                    ind) + ' would not be displayed since the columns to display are all empty for that report.'

                            if isnone:
                                exit = True
                                json_resp['report_message'] = 'DOCUMENTS FILE - ' + rep_name + ' -  The report at row ' + str(ind) + ' has the columns: ' + ', '.join(
                                    list_not_db_col) + ' empty. Provide a value for at least one of these columns.'
                                break

                        if exit:
                            break

                        # check if there are None in mandatory columns
                        el = ''
                        if None in df['document_id'].tolist():
                            el = 'document_id'

                        if el != '':
                            lista = df[el].tolist()
                            ind = lista.index(None)
                            json_resp['report_message'] = 'DOCUMENTS FILE - ' + rep_name + ' - The column ' + el + ' is empty at the row: ' + str(ind) + '.'
                            break

                elif rep_name.endswith('.json'):
                    if isinstance(r[i], str):
                        r[i] = open(r[i], 'r')
                    d = json.load(r[i])
                    if 'collection' not in d.keys():
                        json_resp['reports_message'] = 'DOCUMENTS FILE - ' + rep_name + ' - The json is not well formatted.'
                        break
                    exit = False
                    keys_list = []
                    if len(d['collection']) == 0:
                        json_resp['report_message'] = 'DOCUMENTS FILE - ' + rep_name + ' -  You must provide at least a report.'
                        break
                    for document in d['collection']:

                        ind = d['collection'].index(document)
                        if 'document_id' not in list(document.keys()) or document['document_id'] is None:
                            json_resp['reports_message'] = 'DOCUMENTS FILE - ' + rep_name + ' - The ' + str(
                                ind) + ' document does not contain the "document_id" key which is mandatory.'
                            exit = True
                            break
                        doc_keys = list(document.keys())
                        # docs_tot.append(str(document['document_id']))
                        if 'language' in document.keys():
                            doc_keys.remove('language')
                        doc_keys.remove('document_id')
                        is_none = True
                        for key in doc_keys:
                            if key != 'document_id' and key != 'language':
                                if document[key] is not None:
                                    is_none = False
                                    break

                        if (('document_id' in doc_keys and len(doc_keys) == 1) or ('document_id' in doc_keys and 'language' in doc_keys and len(doc_keys) == 2)) or is_none:
                            json_resp['reports_message'] = 'DOCUMENTS FILE - ' + rep_name + ' - The ' + str(ind) + ' document does not contain the document\' s text.'
                        keys_list.extend(doc_keys)
                        if str(document['document_id']) in documents_ids:
                            json_resp['report_message'] = 'WARNING DOCUMENTS FILE - ' + rep_name + ' - The id ' + str(document['document_id']) + ' is duplicated.'
                        else:
                            documents_ids.append(str(document['document_id']))

                        count_both = 0
                        for el in doc_keys:
                            if el not in jsonann and el not in jsondisp:
                                count_both += 1

                        if count_both == len(doc_keys):
                            json_resp['fields_message'] = 'WARNING REPORT FIELDS TO DISPLAY AND ANNOTATE - ' + rep_name + ' -  With this configuration the report at the row: ' + str(
                                ind) + ' would not be displayed since the columns to display are all empty for that report.'

                    if exit == True:
                        break
                    if isinstance(r[i], str):
                        r[i].close()
        if len(reports) > 0:
            if json_resp['report_message'] == '':
                json_resp['report_message'] = 'Ok'
        for i in range(len(pubmedfiles)):
            # Error if the file is not csv
            if not pubmedfiles[i].name.endswith('csv') and not pubmedfiles[i].name.endswith('json') and not pubmedfiles[i].name.endswith(
                    'txt'):
                json_resp['pubmed_message'] = 'PUBMED FILE - ' + pubmedfiles[i].name + ' - The file must be .csv or .json or .txt'
                break
            if pubmedfiles[i].name.endswith('csv'):
                try:
                    df = pd.read_csv(pubmedfiles[i])
                    df = df.where(pd.notnull(df), None)
                    df = df.reset_index(drop=True)  # Useful if the csv includes only commas
                except Exception as e:
                    print(e)
                    json_resp['pubmed_message'] = 'PUBMED FILE - ' + pubmedfiles[
                        i].name + ' - An error occurred while parsing the csv. Check if it is well formatted. Check if it contains as many columns as they are declared in the header.'
                    pass

                else:
                    # check if colunns are allowed and without duplicates
                    cols = list(df.columns)
                    list_db_col = ['document_id']

                    missing = False
                    for el in list_db_col:
                        if el not in cols and el == 'document_id':
                            json_resp['pubmed_message'] = 'PUBMED FILE - ' + pubmedfiles[i].name + ' - The column: ' + el + ' is missing, please add it.'
                            missing = True
                            break
                    if missing:
                        break

                    for column in cols:
                        null_val = df[df[column].isnull()].index.tolist()
                        if len(null_val) > 0:
                            json_resp['pubmed_message'] = 'PUBMED FILE - ' + pubmedfiles[i].name + ' - You did not inserted the '+column +' for rows: '+null_val.split(', ')

                    # Check if the csv is empty with 0 rows
                    if df.shape[0] == 0:
                        json_resp['pubmed_message'] = 'PUBMED FILE - ' + pubmedfiles[i].name + ' -  You must provide at least a report.'
                        break
                    else:
                        # check if columns id_report and language have no duplicates
                        if 'language' in df:
                            df_dup = df[df.duplicated(subset=['document_id','language'], keep=False)]
                        else:
                            df_dup = df[df.duplicated(subset=['document_id'], keep=False)]
                        if df_dup.shape[0] > 0:
                            json_resp['pubmed_message'] = 'WARNING PUBMED FILE - ' + pubmedfiles[i].name + ' - The rows: ' + str(df_dup.index.to_list()) + ' are duplicated. The duplicates are ignored.'
                    ids = ['PUBMED_'+str(id) for id in list(df.document_id.unique())]
                    documents_ids.extend(ids)
            elif pubmedfiles[i].name.endswith('json'):

                d = json.load(pubmedfiles[i])

                if 'pubmed_ids' not in d.keys():
                    json_resp['pubmed_message'] = 'PUBMED FILE - ' + pubmedfiles[
                        i].name + ' - json is not well formatted.'
                    break
                if d['pubmed_ids'] == []:
                    json_resp['pubmed_message'] = 'PUBMED FILE - ' + pubmedfiles[
                        i].name + ' - you must provide at least an article id.'
                    break
                if not isinstance(d['pubmed_ids'],list):
                    json_resp['pubmed_message'] = 'PUBMED FILE - ' + pubmedfiles[
                        i].name + ' - you must provide at least an article id.'
                    break

                if len(d['pubmed_ids']) != len(list(set(d['pubmed_ids']))):
                    json_resp['pubmed_message'] = 'WARNING PUBMED FILE - ' + runs[
                        i].name + ' - some ids seem to be duplicated. They will be ignored.'
                    break
                ids = ['PUBMED_'+str(id) for id in d['pubmed_ids']]
                documents_ids.extend(ids)



            elif pubmedfiles[i].name.endswith('txt'):

                lines = pubmedfiles[i].readlines()
                ids = ['PUBMED_'+str(line) for line in lines]
                if len(lines) == 0 :
                    json_resp['pubmed_message'] = 'PUBMED FILE - ' + runs[
                        i].name + ' - the file is empty.'
                    break
                if len(lines) != len(list(set(lines))):
                    json_resp['pubmed_message'] = 'WARNING PUBMED FILE - ' + runs[
                        i].name + ' - the file contain some duplicates: they will be ignored.'
                documents_ids.extend(ids)

        if len(pubmedfiles)>0:
            if json_resp['pubmed_message'] == '':
                json_resp['pubmed_message'] = 'Ok'

        if len(topics) > 0:

            for i in range(len(topics)):
                if not topics[i].name.endswith('csv') and not topics[i].name.endswith('json') and not topics[i].name.endswith('txt'):
                    json_resp['topic_message'] = 'TOPIC FILE - ' + topics[i].name + ' - The file must be .csv or .json or .txt'
                    break
                if topics[i].name.endswith('csv'):
                    # if not labels[i].name.endswith('csv'):
                    #     json_resp['label_message'] = 'LABELS FILE - ' + labels[i].name + ' - The file must be .csv'
                    try:
                        df = pd.read_csv(topics[i])
                        df = df.where(pd.notnull(df), None)
                        df = df.reset_index(drop=True)

                    except Exception as e:
                        json_resp['topic_message'] = 'TOPIC FILE - ' + topics[
                            i].name + ' - An error occurred while parsing the csv. Check if is well formatted.'
                        pass

                    else:
                        cols = list(df.columns)
                        list_db_col = ['topic_id','title','description','narrative']
                        # if 'usecase' in cols:
                        #     df['usecase'] = df['usecase'].str.lower()
                        #
                        esco = False
                        for el in list_db_col:
                            if el not in cols and el == 'topic_id':
                                esco = True
                                json_resp['topic_message'] = 'TOPIC FILE - ' + topics[
                                    i].name + ' - The column: ' + el + ' is not present and it is mandatory.'
                                break
                        for el in cols:
                            if el not in list_db_col:
                                json_resp['topic_message'] = 'WARNING TOPIC FILE - ' + topics[
                                    i].name + ' - The column: ' + el + ' is not present.'

                        if esco == True:
                            break

                        for el in cols:
                            if el not in list_db_col:
                                json_resp['topic_message'] = 'TOPIC FILE - ' + topics[
                                    i].name + ' - The column ' + el + ' is not allowed.'
                                break

                        for id in list(df.topic_id.unique()):
                            if str(id) in topics_ids:
                                json_resp['topic_message'] = 'WARNING TOPIC FILE - ' + topics[
                                    i].name + ' - The topic: ' + str(id) + ' is duplicated. The duplicates are ignored.'
                            else:
                                topics_ids.append(str(id))

                        if df.shape[0] == 0:
                            json_resp['topic_message'] = 'TOPIC FILE - ' + topics[
                                i].name + ' - You must provide at least a row.'
                            break
                        else:
                            # check if columns annotation_label and name have no duplicates
                            df_dup = df[df.duplicated(subset=['topic_id'], keep=False)]
                            if df_dup.shape[0] > 0:
                                json_resp['topic_message'] = 'WARNING TOPIC FILE - ' + topics[
                                    i].name + ' - The rows: ' + str(
                                    df_dup.index.to_list()) + ' are duplicated. The duplicates will be ignored.'

                            el = ''
                            # if None in df['usecase'].tolist():
                            #     el = 'usecase'
                            if None in df['topic_id'].tolist():
                                el = 'topic_id'
                            if el != '':
                                lista = df[el].tolist()
                                ind = lista.index(None)
                                json_resp['topic_message'] = 'TOPIC FILE - ' + topics[
                                    i].name + ' - The column ' + el + ' is empty at the row: ' + str(ind) + ' .'
                                break

                elif topics[i].name.endswith('.json'):
                    # with open(topics[i], 'r') as f:
                        d = json.load(topics[i])
                        doc_top = []
                        if 'topics' not in d.keys():
                            json_resp['topic_message'] = 'TOPIC FILE - ' + topics[
                                i].name + ' - json is not well formatted.'
                            break

                        if d['topics'] == []:
                            json_resp['topic_message'] = 'TOPIC FILE - ' + labels[
                                i].name + ' - you must provide at least a label.'
                            break

                        for topic in d['topics']:
                            ind = d['topics'].index(topic)

                            if 'topic_id' not in list(topic.keys()):
                                json_resp['topic_message'] = 'TOPIC FILE - ' + topics[
                                    i].name + ' - you must provide a topic number in the '+str(ind)+' th topic.'
                                break
                            doc_top.append(str(topic['topic_id']))
                            if str(topic['topic_id']) in topics_ids:
                                json_resp['topic_message'] = 'WARNING TOPIC FILE - ' + topics[
                                    i].name + ' - the list of topics contains duplicates. They will be ignored.'

                            else:
                                topics_ids.append(str(topic['topic_id']))

                        if len(doc_top) > len(set(doc_top)):
                            json_resp['topic_message'] = 'WARNING TOPIC FILE - ' + topics[
                            i].name + ' - the list of topics contains duplicates. They will be ignored.'
                elif topics[i].name.endswith('.txt'):
                    arr_to_ret = elaborate_runs(runs)
                    topics_ids = elaborate_TREC_topic_files([],topics[i],'check')
                    topics_ids = [str(i) for i in topics_ids]
                    if isinstance(topics_ids,list) == False:
                        json_resp['topic_message'] = 'TOPIC FILE - ' + topics[i].name + ' - topics are not well formatted.'
                        break

            if json_resp['topic_message'] == '':
                json_resp['topic_message'] = 'Ok'

        if len(runs) > 0:
            for i in range(len(runs)):
                if not runs[i].name.endswith('csv') and not runs[i].name.endswith('json') and not runs[i].name.endswith('txt'):
                    json_resp['runs_message'] = 'RUNS FILE - ' + runs[i].name + ' - The file must be .csv or .json or .txt'
                    break
                if runs[i].name.endswith('csv'):
                    print(runs[i])
                    # if not labels[i].name.endswith('csv'):
                    #     json_resp['label_message'] = 'LABELS FILE - ' + labels[i].name + ' - The file must be .csv'
                    try:
                        df = pd.read_csv(runs[i])
                        df = df.where(pd.notnull(df), None)
                        df = df.reset_index(drop=True)

                    except Exception as e:
                        print(e)
                        json_resp['runs_message'] = 'RUNS FILE - ' + runs[
                            i].name + ' - An error occurred while parsing the csv. Check if is well formatted.'
                        pass

                    else:
                        cols = list(df.columns)

                        list_db_col = ['topic_id', 'document_id','language']

                        esco = False
                        for el in list_db_col:
                            if el not in cols and el != 'language':
                                esco = True
                                json_resp['runs_message'] = 'RUNS FILE - ' + runs[
                                    i].name + ' - The column: ' + el + ' is not present and it is mandatory.'
                                break

                        if esco == True:
                            break

                        for el in cols:
                            if el not in list_db_col:
                                json_resp['runs_message'] = 'RUNS FILE - ' + runs[
                                    i].name + ' - The column ' + el + ' is not allowed.'
                                break

                        if df.shape[0] == 0:
                            json_resp['runs_message'] = 'RUNS FILE - ' + runs[
                                i].name + ' - You must provide at least a row.'
                            break
                        else:
                            # check if columns annotation_label and name have no duplicates
                            if 'language' in df:
                                df_dup = df[df.duplicated(subset=['topic_id','document_id','language'], keep=False)]
                            else:
                                df_dup = df[df.duplicated(subset=['topic_id','document_id'], keep=False)]
                            if df_dup.shape[0] > 0:
                                json_resp['runs_message'] = 'WARNING RUNS FILE - ' + runs[
                                    i].name + ' - The rows: ' + str(
                                    df_dup.index.to_list()) + ' are duplicated. The duplicates will be ignored.'

                            el = ''
                            # if None in df['usecase'].tolist():
                            #     el = 'usecase'
                            if None in df['topic_id'].tolist():
                                el = 'topic_id'
                            if None in df['document_id'].tolist():
                                el = 'document_id'
                            if 'language' in df:
                                el = 'language'
                            if el != '':
                                lista = df[el].tolist()
                                ind = lista.index(None)
                                json_resp['runs_message'] = 'RUNS FILE - ' + runs[
                                    i].name + ' - The column ' + el + ' is empty at the row: ' + str(ind) + ' .'
                                break

                        tops.extend(df.topic_id.unique())
                        for el in tops:
                            if str(el) not in topics_ids:
                                json_resp['runs_message'] = 'RUNS FILE - ' + runs[
                                    i].name + ' - The topic: ' + str(el) + ' is not in the provided list of topics.'
                                break
                        docs.extend(df.document_id.unique())
                        for el in docs:
                            if str(el) not in documents_ids:
                                json_resp['runs_message'] = 'RUNS FILE - ' + runs[
                                    i].name + ' - The document: ' + str(el) + ' is not in the provided list of documents.'
                                break


                elif runs[i].name.endswith('.json'):
                    # with open(runs[i], 'r') as f:
                        d = json.load(runs[i])

                        if 'run' not in d.keys():
                            json_resp['runs_message'] = 'RUNS FILE - ' + runs[
                                i].name + ' - json is not well formatted.'
                            break

                        if d['run'] == []:
                            json_resp['runs_message'] = 'RUNS FILE - ' + runs[
                                i].name + ' - you must provide at least a topic and one or more documents associated.'
                            break

                        for r in d['run']:
                            ind = d['run'].index(r)

                            if 'topic_id' not in r.keys():
                                json_resp['runs_message'] = 'RUNS FILE - ' + topics[
                                    i].name + ' - you must provide a topic number in the ' + str(ind) + ' th element.'
                                break

                            if 'documents' not in r.keys():
                                json_resp['runs_message'] = 'RUNS FILE - ' + topics[
                                    i].name + ' - you must provide a topic\'s list for the topic:  ' + str(r['num']) + '.'
                                break
                            if isinstance(r['documents'][0],dict):
                                doc1 = [el['document_id'] for el in r['documents']]
                            else:
                                doc1 = r['documents']
                            for el in r['documents']:
                                if isinstance(el,dict):

                                    if 'document_id' not in el.keys() and 'language' not in el.keys():
                                        json_resp['runs_message'] = 'RUNS FILE - ' + topics[
                                            i].name + ' - you must provide a document_id and a language'
                                        break

                            tops.append(r['topic_id'])
                            docs.extend(doc1)

                        for el in tops:
                            if el not in topics_ids:
                                json_resp['runs_message'] = 'RUNS FILE - ' + runs[
                                    i].name + ' - The topic: ' + str(el) + ' is not in the provided list of topics.'
                                break
                        for el in docs:
                            if str(el) not in documents_ids:
                                json_resp['runs_message'] = 'RUNS FILE - ' + runs[
                                    i].name + ' - The document: ' + str(el) + ' is not in the provided list of documents.'
                                break


                elif runs[i].name.endswith('.txt'):
                    # with open(runs[i], 'r') as f:
                    lines = runs[i].readlines()
                    tups = []

                    for line in lines:
                        line = line.decode('utf-8')
                        if len(line.split()) == 2 or len(line.split() == 3):
                            topic = line.split()[0]
                            tops.append(topic)
                            doc = line.split()[1]
                            docs.append(doc)
                            tups.append((topic,doc))
                        elif len(line.split()) > 2: #TREC
                            topic = line.split()[0]
                            tops.append(topic)
                            doc = line.split()[2]
                            tups.append((topic, doc))
                            docs.append(doc)
                        else:
                            json_resp['run_message'] = 'RUNS FILE - ' + runs[i].name + ' - txt file is not well formatted.'
                            break

                    for el in tops:
                        if str(el) not in topics_ids:
                            json_resp['runs_message'] = 'RUNS FILE - ' + runs[
                                i].name + ' - The topic: ' + str(el) + ' is not in the provided list of topics.'
                            break
                    for el in docs:
                        if str(el) not in documents_ids:
                            json_resp['runs_message'] = 'RUNS FILE - ' + runs[
                                i].name + ' - The document: ' + str(el) + ' is not in the provided list of documents.'
                            break

            if json_resp['runs_message'] == '':
                json_resp['runs_message'] = 'Ok'




        if len(concepts) > 0:
            for i in range(len(concepts)):
                # Check if it is a csv
                if concepts[i].name.endswith('csv'):
                    # json_resp['concept_message'] = 'CONCEPTS FILE - ' + concepts[i].name + ' - The file must be .csv'

                    try:
                        df = pd.read_csv(concepts[i])
                        df = df.where(pd.notnull(df), None)
                        df = df.reset_index(drop=True)
                    except Exception as e:
                        json_resp['concept_message'] = 'CONCEPTS FILE - ' + concepts[i].name + ' - An error occurred while parsing the csv. Check if it is well formatted. '
                        pass
                    # print(df)
                    else:

                        cols = list(df.columns)
                        columns_wrong = False
                        list_db_col = ['concept_url', 'concept_name']
                        # if 'usecase' in cols:
                        #     df['usecase'] = df['usecase'].str.lower()


                        # Check if all the mandatory cols are present
                        for el in list_db_col:
                            if el not in cols:
                                columns_wrong = True
                                json_resp['concept_message'] = 'CONCEPTS FILE - ' + concepts[i].name + ' - The column ' + el + ' is not present. The only columns allowed are: concept_utl, concept_name, usecase, area'
                                break
                        if columns_wrong == True:
                            break

                        # if load_concepts is not None:
                        #     for el in load_concepts:
                        #         if el in df.usecase.unique():
                        #             json_resp['concept_message'] = 'CONCEPTS FILE - ' + concepts[i].name + ' - You can not insert concepts files for the use case ' + el + ' after having decide to use EXAMODE concepts.'
                        #             break

                        # header length must be the same, no extra columns
                        if len(list_db_col) != len(cols):
                            json_resp['concept_message'] = 'CONCEPTS FILE - ' + concepts[i].name + ' - The columns allowed are: concept_url, concept_name. If you inserted more (less) columns please, remove (add) them.'
                            break

                        # Check if the df has no rows
                        if df.shape[0] == 0:
                            json_resp['concept_message'] = 'CONCEPTS FILE - ' + concepts[i].name + ' - You must provide at least a concept.'
                            break
                        else:
                            # check if column concept_url has no duplicates
                            df_dup = df[df.duplicated(subset=['concept_url'], keep=False)]
                            if df_dup.shape[0] > 0:
                                json_resp['concept_message'] = 'WARNING CONCEPTS FILE - ' + concepts[i].name + ' - The rows: ' + str(df_dup.index.to_list()) + ' are duplicated. The duplicates will be ignored.'

                            # Check if there are None in mandatory cols
                            el = ''
                            if None in df['concept_url'].tolist():
                                el = 'concept_url'
                            elif None in df['concept_name'].tolist():
                                el = 'concept_name'

                            if el != '':
                                lista = df[el].tolist()
                                ind = lista.index(None)
                                json_resp['concept_message'] = 'CONCEPTS FILE - ' + concepts[i].name + ' - The column ' + el + ' is empty at the row: ' + str(ind) + ' .'
                                break

                if concepts[i].name.endswith('json'):
                    # json_resp['concept_message'] = 'CONCEPTS FILE - ' + concepts[i].name + ' - The file must be .csv'
                    d = json.load(concepts[i])
                    if 'concepts_list' not in d.keys():
                        json_resp['concept_message'] = 'CONCEPTS FILE - ' + concepts[
                            i].name + ' - json is not well formatted'
                        break
                    if not isinstance(d['concepts_list'],list):
                        json_resp['concept_message'] = 'CONCEPTS FILE - ' + concepts[
                            i].name + ' - json is not well formatted'
                        break
                    if len(d['concepts_list']) == 0:
                        json_resp['concept_message'] = 'CONCEPTS FILE - ' + concepts[
                            i].name + ' - the list is empty'
                        break
                    dup_list = []
                    for element in d['concepts_list']:
                        if 'concept_url' not in element.keys() and 'concept_name' not in element.keys():
                            json_resp['concept_message'] = 'CONCEPTS FILE - ' + concepts[
                                i].name + ' - each element in the list of concepts must contains concept_url and concept_name'

                        break
                    for element in d['concepts_list']:
                        if element['concept_url'] in dup_list:
                            json_resp['concept_message'] = 'WARNING CONCEPTS FILE - ' + concepts[
                                i].name + ' - Some concepts are duplicated, these will be ignored'

            if json_resp['concept_message'] == '':
                json_resp['concept_message'] = 'Ok'

        if len(labels) > 0:
            for i in range(len(labels)):
                if labels[i].name.endswith('csv'):
                    # if not labels[i].name.endswith('csv'):
                    #     json_resp['label_message'] = 'LABELS FILE - ' + labels[i].name + ' - The file must be .csv'
                    try:
                        df = pd.read_csv(labels[i])
                        df = df.where(pd.notnull(df), None)
                        df = df.reset_index(drop=True)

                    except Exception as e:
                        json_resp['label_message'] = 'LABELS FILE - ' + labels[i].name + ' - An error occurred while parsing the csv. Check if is well formatted.'
                        pass

                    else:
                        cols = list(df.columns)
                        list_db_col = ['label']
                        # if 'usecase' in cols:
                        #     df['usecase'] = df['usecase'].str.lower()
                        #
                        esco = False
                        for el in list_db_col:
                            if el not in cols:
                                esco = True
                                json_resp['label_message'] = 'LABELS FILE - ' + labels[i].name + ' - The columns: ' + el + ' is not present. The columns allowed are: labels, usecase.'

                        if esco == True:
                            break


                        if len(cols) != len(list_db_col):
                            json_resp['label_message'] = 'LABELS FILE - ' + labels[i].name + ' - The columns allowed are: label, usecase. If you inserted more (less) columns please, remove (add) them.'
                            break

                        if df.shape[0] == 0:
                            json_resp['label_message'] = 'LABELS FILE - ' + labels[i].name + ' - You must provide at least a row.'
                            break
                        else:
                            # check if columns annotation_label and name have no duplicates
                            df_dup = df[df.duplicated(subset=['label'], keep=False)]
                            if df_dup.shape[0] > 0:
                                json_resp['label_message'] = 'WARNING LABELS FILE - ' + labels[i].name + ' - The rows: ' + str(df_dup.index.to_list()) + ' are duplicated. The duplicates will be ignored.'

                            el = ''
                            # if None in df['usecase'].tolist():
                            #     el = 'usecase'
                            if None in df['label'].tolist():
                                el = 'label'
                            if el != '':
                                lista = df[el].tolist()
                                ind = lista.index(None)
                                json_resp['label_message'] = 'LABELS FILE - ' + labels[i].name + ' - The column ' + el + ' is empty at the row: ' + str(ind) + ' .'
                                break

                elif labels[i].name.endswith('.json'):
                    # with open(labels[i],'r') as f:
                        d = json.load(labels[i])
                        if 'labels' not in d.keys():
                            json_resp['label_message'] = 'LABELS FILE - ' + labels[i].name + ' - json is not well formatted.'
                            break

                        if d['labels'] == []:
                            json_resp['label_message'] = 'LABELS FILE - ' + labels[
                                i].name + ' - you must provide at least a label.'
                            break
                        labels = d['labels']
                        if len(labels) > len(set(labels)):
                            json_resp['label_message'] = 'WARNING LABELS FILE - ' + labels[
                                i].name + ' - the list of labels contains duplicates. They will be ignored.'


                elif labels[i].name.endswith('.txt'):
                    # with open(labels[i], 'r') as f:
                        lines = labels[i].readlines()
                        labels_list = []
                        if len(lines) == 0:
                            json_resp['label_message'] = 'LABELS FILE - ' + labels[i].name + ' - you must provide at least a label.'
                            break
                        for line in lines:
                            line = line.decode('utf-8')
                            if line not in labels_list:
                                labels_list.append(line)
                            else:
                                json_resp['label_message'] = 'WARNING LABELS FILE - ' + labels[
                                    i].name + ' - the list of labels contains duplicates. They will be ignored.'

            if json_resp['label_message'] == '':
                json_resp['label_message'] = 'Ok'

        if len(jsonAnn) == 0 and len(jsonDisp) == 0 and len(reports)>0:
            json_resp['fields_message'] = 'REPORT FIELDS TO DISPLAY AND ANNOTATE - Please provide at least one field to be displayed and/or at least one field to be annotated.'

        elif len(jsonAnn) == 0  and len(reports)>0:
            if json_resp['fields_message'] == '':
                json_resp['fields_message'] = 'WARNING REPORT FIELDS TO ANNOTATE - ok but with this configuration you will not be able to perform mention annotation and linking. Please, select also at least a field to annotate if you want to find some mentions and link them.'

        if len(reports) > 0:
            if json_resp['fields_message'] == '':
                json_resp['fields_message'] = 'Ok'

    except Exception as e:
        print(e)
        json_resp['general_message'] = 'An error occurred. Please check if it is similar to the example we provided.'
        return json_resp

    else:
        if json_resp['general_message'] == '':
            json_resp['general_message'] = 'Ok'
        return json_resp


import time
from datetime import date


def configure_data(pubmedfiles,reports, labels, concepts, jsondisp, jsonann, jsonall, username, password, topics,runs,tfidf):

    """This method is run after having checked the files inserted by the user"""

    filename = ''
    language = 'english'
    error_location = 'database'
    report_usecases = []
    created_file = False
    today = str(date.today())

    try:
        with transaction.atomic():
            cursor = connection.cursor()
            cursor.execute("DELETE FROM annotate;")
            cursor.execute("DELETE FROM linked;")
            cursor.execute("DELETE FROM associate;")
            cursor.execute("DELETE FROM contains;")
            cursor.execute("DELETE FROM mention;")
            cursor.execute("DELETE FROM belong_to;")
            cursor.execute("DELETE FROM annotation_label;")
            cursor.execute("DELETE FROM concept;")
            cursor.execute("DELETE FROM ground_truth_log_file;")
            cursor.execute("DELETE FROM topic_has_document;")
            cursor.execute("DELETE FROM report;")
            cursor.execute("DELETE FROM use_case;")
            cursor.execute("DELETE FROM semantic_area;")
            # connection.commit()
            cursor.execute("DELETE FROM public.user WHERE username = 'Test'")
            cursor.execute("INSERT INTO semantic_area VALUES (%s)",('default_area',))
            if username is not None and password is not None:
                cursor.execute("INSERT INTO public.user (username,password,profile,ns_id) VALUES(%s,%s,%s,%s);",
                               (str(username), hashlib.md5(str(password).encode()).hexdigest(), 'Admin', 'Human'))
                cursor.execute("INSERT INTO public.user (username,password,profile,ns_id) VALUES(%s,%s,%s,%s);",
                               (str(username), hashlib.md5(str(password).encode()).hexdigest(), 'Admin', 'Robot'))

            fields = []
            all_fields = []
            fields_to_ann = []

            jsonall = ''.join(jsonall)
            jsondisp = ''.join(jsondisp)
            jsonann = ''.join(jsonann)

            jsonall = jsonall.split(',')
            jsondisp = jsondisp.split(',')
            jsonann = jsonann.split(',')


            for el in jsonall:
                if len(el) > 0:
                    all_fields.append(el)
            for el in jsondisp:
                if len(el) > 0:
                    fields.append(el)
                    if el not in all_fields:
                        all_fields.append(el)
            for el in jsonann:
                if len(el) > 0:
                    fields_to_ann.append(el)
                    if el not in all_fields:
                        all_fields.append(el)
            language = 'english'
            arr_to_ret = elaborate_runs(runs)
            error_location = 'Topic'
            for topic in topics:
                if topic.name.endswith('txt'):
                    elaborate_TREC_topic_files(arr_to_ret,topic)
                elif topic.name.endswith('json'):
                    process_topic_json_file(arr_to_ret,topic)
                elif topic.name.endswith('csv'):
                    process_topic_csv_file(arr_to_ret,topic)

            error_location = 'Collection'

            for file in reports:
                reps = decompress_files([file])
                for f in reps:

                    if isinstance(f, str):
                        file_name = f
                        workpath = os.path.dirname(os.path.abspath(__file__))  # Returns the Path your .py file is in
                        f = os.path.join(workpath, 'static\\tmp\\' + f)
                    else:
                        file_name = f.name
                    if file_name.endswith('json'):
                        find_docs_in_json_collection(arr_to_ret,f)
                    elif file_name.endswith('csv'):
                        find_docs_in_csv_collection(arr_to_ret,f)

            for file in pubmedfiles:
                # if file.name.endswith('json'):
                find_docs_in_json_pubmed_collection(arr_to_ret,file)


            error_location = 'Runs'
            for el in arr_to_ret:
                if len(el) == 3:
                    language = el[2]
                topic = UseCase.objects.get(name = el[0])
                doc = Report.objects.get(id_report =str(el[1]),language = 'english')

                TopicHasDocument.objects.get_or_create(name = topic,language = doc.language,id_report =doc)


            if len(labels) > 0:
                labs = []
                error_location = 'Labels'
                for label_file in labels:
                    if label_file.name.endswith('csv'):
                        df_labels = pd.read_csv(label_file)
                        df_labels = df_labels.where(pd.notnull(df_labels), None)
                        df_labels = df_labels.reset_index(drop=True)
                        # df_labels['usecase'] = df_labels['usecase'].str.lower()
                        count_lab_rows = df_labels.shape[0]
                        for i in range(count_lab_rows):
                            label = str(df_labels.loc[i, 'label'])
                            labs.append(label.rstrip())
                    elif label_file.name.endswith('json'):
                        d = json.load(label_file)
                        labels = d['labels']
                        for label in labels:
                            labs.append(label.rstrip())
                    elif label_file.name.endswith('txt'):
                        lines = label_file.readlines()
                        for line in lines:
                            line = line.decode('utf-8')
                            labs.append(line.replace('\n',''))


                for label in labs:
                    cursor.execute('SELECT * FROM annotation_label')
                    ans = cursor.fetchall()
                    if len(ans) == 0:
                        seq_number = 1
                    else:
                        cursor.execute('SELECT seq_number FROM annotation_label ORDER BY seq_number DESC;')
                        ans = cursor.fetchall()
                        seq_number = int(ans[0][0]) + 1

                    cursor.execute("SELECT * FROM annotation_label WHERE label = %s;",
                                   (str(label),))
                    ans = cursor.fetchall()
                    if len(ans) == 0:
                        cursor.execute("INSERT INTO annotation_label (label,seq_number) VALUES (%s,%s);",
                                       (str(label), int(seq_number)))

            # Popolate the concepts table
            error_location = 'Concepts'
            # if load_concepts is not None and load_concepts != '' and load_concepts !=[] and len(concepts) == 0:
            #     configure_concepts(cursor,load_concepts,'admin')

            for concept_file in concepts:
                if concept_file.name.endswith('csv'):
                    df_concept = pd.read_csv(concept_file)
                    df_concept = df_concept.where(pd.notnull(df_concept), None)
                    df_concept = df_concept.reset_index(drop=True)
                    # df_concept['usecase'] = df_concept['usecase'].str.lower()

                    # print(df_concept)
                    count_conc_rows = df_concept.shape[0]

                    for i in range(count_conc_rows):
                        df_concept = df_concept.where(pd.notnull(df_concept), None)
                        concept_url = str(df_concept.loc[i, 'concept_url'])
                        concept_name = str(df_concept.loc[i, 'concept_name'])
                        # usecase = str(df_concept.loc[i, 'usecase'])
                        # semantic_area = str(df_concept.loc[i, 'area'])

                        cursor.execute("SELECT concept_url,json_concept FROM concept WHERE concept_url = %s;",
                                       (str(concept_url),))
                        ans = cursor.fetchall()
                        if len(ans) == 0:
                            # json_concept = json.dumps({'provenance': 'admin', 'insertion_author': 'admin'})
                            cursor.execute("INSERT INTO concept (concept_url,name) VALUES (%s,%s);",
                                           (str(concept_url), str(concept_name)))

                        cursor.execute("SELECT * FROM belong_to WHERE concept_url = %s AND name=%s;",
                                       (str(concept_url), 'default_area'))
                        ans = cursor.fetchall()
                        if len(ans) == 0:
                            cursor.execute("INSERT INTO belong_to (concept_url,name) VALUES (%s,%s);",
                                           (str(concept_url), 'default_area'))
                elif concept_file.name.endswith('json'):

                        d = json.load(concept_file)
                        count_conc_rows = len(d['concepts_list'])
                        for i in range(count_conc_rows):
                            concept_url = str(d['concepts_list'][i]['concept_url'])
                            concept_name = str(d['concepts_list'][i]['concept_name'])
                            # usecase = str(df_concept.loc[i, 'usecase'])
                            # semantic_area = str(df_concept.loc[i, 'area'])

                            cursor.execute("SELECT concept_url,json_concept FROM concept WHERE concept_url = %s;",
                                           (str(concept_url),))
                            ans = cursor.fetchall()
                            if len(ans) == 0:
                                # json_concept = json.dumps({'provenance': 'admin', 'insertion_author': 'admin'})
                                cursor.execute("INSERT INTO concept (concept_url,name) VALUES (%s,%s);",
                                               (str(concept_url), str(concept_name)))

                            cursor.execute("SELECT * FROM belong_to WHERE concept_url = %s AND name=%s;",
                                           (str(concept_url), 'default_area'))
                            ans = cursor.fetchall()
                            if len(ans) == 0:
                                cursor.execute("INSERT INTO belong_to (concept_url,name) VALUES (%s,%s);",
                                               (str(concept_url), 'default_area'))
            data = {}
            data['fields'] = fields
            data['fields_to_ann'] = fields_to_ann
            data['all_fields'] = all_fields
            version = get_version()
            workpath = os.path.dirname(os.path.abspath(__file__))  # Returns the Path your .py file is in
            version_new = int(version) + 1
            filename = 'fields' + str(version_new)
            created_file = False
            with open(os.path.join(workpath, './config_files/data/' + filename + '.json'), 'w') as outfile:
                json.dump(data, outfile)
                created_file = True

    except (Exception, psycopg2.Error) as e:
        print(e)
        print('rollback')
        # connection.rollback()
        if created_file == True:
            workpath = os.path.dirname(os.path.abspath(__file__))  # Returns the Path your .py file is in
            if filename != '' and filename != 'fields0':
                path = os.path.join(workpath, './config_files/data/' + filename + '.json')
                os.remove(path)

        json_resp = {'error': 'an error occurred in: ' + error_location + '.'}
        return json_resp
    else:
        # connection.commit()
        if created_file == True:
            for filen in os.listdir(os.path.join(workpath, './config_files/data')):
                if filen.endswith('json'):
                    if filen != '' and filen != 'fields0.json' and filen != filename+'.json':
                        path = os.path.join(workpath, './config_files/data/' + filen )
                        os.remove(path)
        outfile.close()

        if tfidf is not None or (len(runs) > 0 and len(topics) > 0 and (len(reports) > 0) or len(pubmedfiles) > 0):
            print(str(tfidf))
            if int(tfidf) > 0:
                workpath = os.path.dirname(os.path.abspath(__file__))  # Returns the Path your .py file is in
                path1 = os.path.join(workpath, './config_files/config.json')
                g = open(path1,'r')
                data = json.load(g)
                data['TF-IDF_k'] = tfidf
                with open(path1, 'w') as f:
                    json.dump(data, f)

                t = UseCase.objects.all()
                cursor = connection.cursor()
                # cursor.execute(
                #     "SELECT r.id_report,report_json FROM report AS r INNER JOIN topic_has_document AS t ON t.id_report = r.id_report and r.language = t.language")
                # corpus = []
                # ans = cursor.fetchall()
                # for el in ans:
                #     e = json.loads(el[1])
                #     r_j1 = {}
                #     r_j1['document_id'] = str(el[0])
                #     r_j1['text'] = ''
                #     for k in e.keys():
                #         if k != 'document_id':
                #             r_j1['text'] = r_j1['text'] + ' ' + e[k]
                #     corpus.append(r_j1)

                json_to_write = {}
                for top in t:
                    print('topic:'+str(top))
                    json_to_write[top.name] = {}
                    topic = {}
                    corpus = []
                    cursor.execute(
                        "SELECT r.id_report,r.language,r.report_json FROM report as r inner join topic_has_document as t on t.id_report = r.id_report and r.language = t.language where t.name = %s",
                        [str(top.name)])
                    ans = cursor.fetchall()
                    for el in ans:
                        e = json.loads(el[2])
                        r_j1 = {}

                        r_j1['document_id'] = str(el[0])
                        r_j1['text'] = ''
                        for k in e.keys():
                            if k != 'document_id' or (str(el[0]).startswith('PUBMED_') and (k == 'abstract' or k == 'title')):
                                r_j1['text'] = r_j1['text'] + ' ' + str(e[k])
                        corpus.append(r_j1)
                    topic['title'] = top.title
                    topic['description'] = top.description
                    df_tfidf = gen_tfidf_map(corpus)

                    for el in ans:
                        start = time.time()
                        print('working on ', str(el[0]))
                        e = json.loads(el[2])
                        r_j1 = {}
                        r_j1['document_id'] = str(el[0])
                        r_j1['text'] = ''
                        for k in e.keys():
                            print(k)
                            print(e[k])
                            if isinstance(e[k],list):
                                e[k] = ', '.join(e[k])
                            if k != 'document_id' and k != 'language' and e[k] is not None:
                                r_j1['text'] = r_j1['text'] + ' ' + e[k]
                        tfidf_matcher = QueryDocMatcher(topic, r_j1, corpus,df_tfidf)
                        top_k_matching_words = []
                        top_k_matching_words = tfidf_matcher.get_words_to_highlight()

                        # print(top_k_matching_words)

                        # json_val = {}
                        # json_val[str(el[0])] = top_k_matching_words
                        # json_val['words'] = top_k_matching_words
                        json_to_write[top.name][str(el[0])] = top_k_matching_words
                        # print(json_to_write)
                        end = time.time()
                        print('elaborated in '+str(end-start)+' seconds')
            else:
                json_to_write = {}
            path2 = os.path.join(workpath, './config_files/tf_idf_map.json')
            with open(path2, 'w') as f:
                json.dump(json_to_write, f)

        json_resp = {'message': 'Ok'}
        return json_resp

#-------------------UPDATE----------------------------


def check_for_update(type_req, pubmedfiles, reports, labels, concepts, jsonDisp, jsonAnn, jsonDispUp, jsonAnnUp,topics,runs,tf_idf):

    """This method checks the files inserted by the user to update the db"""

    keys = get_fields_from_json()
    ann = keys['fields_to_ann']
    disp = keys['fields']
    tops = []
    docs = []
    if jsonDispUp is not None and jsonAnnUp is not None:
        jsonDispUp = ''.join(jsonDispUp)
        jsonAnnUp = ''.join(jsonAnnUp)
        jsonDispUp = jsonDispUp.split(',')
        jsonAnnUp = jsonAnnUp.split(',')

    try:

        cursor = connection.cursor()
        message = ''
        if tf_idf is not None:
            message = 'TF-IDF - the value must include only digits'
            return message
        if len(concepts) > 0:
            message = ''
            for i in range(len(concepts)):
                if not concepts[i].name.endswith('csv') and not concepts[i].name.endswith('json'):
                    message = 'CONCEPTS FILE - ' + labels[i].name + ' - The file must be .csv, .json'
                    return message
                if concepts[i].name.endswith('csv'):

                    try:
                        df = pd.read_csv(concepts[i])
                        df = df.where(pd.notnull(df), None)
                        df = df.reset_index(drop=True)

                    except Exception as e:
                        message = 'CONCEPTS FILE - ' + concepts[
                            i].name + ' - An error occurred while parsing the csv. Check if it is well formatted.'
                        return message
                    else:
                        list_db_col = ['concept_url', 'concept_name']
                        cols = list(df.columns)

                        for el in list_db_col:
                            if el not in cols:
                                message = 'CONCEPTS FILE - ' + concepts[i].name + ' - The columns: ' + el + ' is missing. Please, add it.'
                                return message

                        if len(list_db_col) != len(cols):
                            message = 'CONCEPTS FILE - ' + concepts[i].name + ' - The columns allowed are: concept_url, concept_name. If you inserted more (less) columns please, remove (add) them.'
                            return message

                        if df.shape[0] == 0:
                            message = 'CONCEPTS FILE - ' + concepts[i].name + ' - You must provide at least a concept.'
                            return message
                        else:
                            # duplicates in file
                            df_dup = df[df.duplicated(subset=['concept_url'], keep=False)]
                            if df_dup.shape[0] > 0:
                                message = 'WARNING CONCEPTS FILE - ' + concepts[i].name + ' - The rows: ' + str(
                                    df_dup.index.to_list()) + ' are duplicated. The duplicates will be ignored.'

                            el = ''
                            if None in df['concept_url'].tolist():
                                el = 'concept_url'
                            elif None in df['concept_name'].tolist():
                                el = 'concept_name'

                            if el != '':
                                lista = df[el].tolist()
                                ind = lista.index(None)
                                message = 'CONCEPTS FILE - ' + concepts[i].name + ' - The column ' + el + ' is empty at the row: ' + str(ind) + '.'
                                return message

                            # Check for duplicates in db
                            for ind in range(df.shape[0]):
                                cursor.execute('SELECT COUNT(*) FROM concept WHERE concept_url = %s',
                                               [str(df.loc[ind, 'concept_url'])])
                                num = cursor.fetchone()

                                cursor.execute('SELECT COUNT(*) FROM belong_to WHERE concept_url = %s and name = %s',
                                               [str(df.loc[ind, 'concept_url']),str(df.loc[ind, 'area'])])
                                num_b = cursor.fetchone()
                                if num[0] > 0 and num_b[0] > 0:
                                    message = 'WARNING CONCEPTS FILE - ' + concepts[i].name + ' - The concept: ' + str(
                                        df.loc[ind, 'concept_url']) + '  is already present in the database. It will be ignored.'
                    if concepts[i].name.endswith('json'):
                            # json_resp['concept_message'] = 'CONCEPTS FILE - ' + concepts[i].name + ' - The file must be .csv'
                        d = json.load(concepts[i])
                        if 'concepts_list' in d.keys():
                            message = 'CONCEPTS FILE - ' + concepts[
                                i].name + ' - json is not well formatted'
                            return message
                        if not isinstance(d['concepts_list'], list):
                            message = 'CONCEPTS FILE - ' + concepts[
                                i].name + ' - json is not well formatted'
                            return message
                        if len(d['concepts_list']) == 0:
                            message = 'CONCEPTS FILE - ' + concepts[
                                i].name + ' - the list is empty'
                            return message
                        dup_list = []
                        for element in d['concepts_list']:
                            if 'concept_url' not in element.keys() and 'concept_name' not in element.keys():
                                message = 'CONCEPTS FILE - ' + concepts[
                                    i].name + ' - each element in the list of concepts must contains concept_url and concept_name fields'

                            return message
                        for element in d['concepts_list']:
                            if element['concept_url'] in dup_list:
                                message = 'WARNING CONCEPTS FILE - ' + concepts[
                                    i].name + ' - Some concepts are duplicated, these will be ignored'

                return message

        elif len(labels) > 0:
            message = ''

            for i in range(len(labels)):
                if not labels[i].name.endswith('csv') and not labels[i].name.endswith('json') and not labels[i].name.endswith('txt'):
                    message = 'LABELS FILE - ' + labels[i].name + ' - The file must be .csv, .json, .txt'
                    return message
                if labels[i].name.endswith('csv'):

                    try:
                        df = pd.read_csv(labels[i])
                        df = df.where(pd.notnull(df), None)
                        df = df.reset_index(drop=True)

                    except Exception as e:
                        message = 'LABELS FILE - ' + labels[i].name + ' - An error occurred while parsing the csv. Check if is well formatted.'
                        return message

                    else:
                        cols = list(df.columns)
                        list_db_col = ['label']
                        # if 'usecase' in cols:
                        #     df['usecase'] = df['usecase'].str.lower()
                        #
                        esco = False
                        for el in list_db_col:
                            if el not in cols:
                                esco = True
                                message = 'LABELS FILE - ' + labels[i].name + ' - The columns: ' + el + ' is not present. The columns allowed are: labels, usecase.'
                                return message
                        if esco == True:
                            break


                        if len(cols) != len(list_db_col):
                            message = 'LABELS FILE - ' + labels[i].name + ' - The columns allowed are: label, usecase. If you inserted more (less) columns please, remove (add) them.'
                            return message

                        if df.shape[0] == 0:
                            message = 'LABELS FILE - ' + labels[i].name + ' - You must provide at least a row.'
                            return message
                        else:
                            # check if columns annotation_label and name have no duplicates
                            df_dup = df[df.duplicated(subset=['label'], keep=False)]
                            if df_dup.shape[0] > 0:
                                message = 'WARNING LABELS FILE - ' + labels[i].name + ' - The rows: ' + str(df_dup.index.to_list()) + ' are duplicated. The duplicates will be ignored.'
                                return message
                            el = ''
                            # if None in df['usecase'].tolist():
                            #     el = 'usecase'
                            if None in df['label'].tolist():
                                el = 'label'
                            if el != '':
                                lista = df[el].tolist()
                                ind = lista.index(None)
                                message = 'LABELS FILE - ' + labels[i].name + ' - The column ' + el + ' is empty at the row: ' + str(ind) + ' .'
                                return message

                            for ind in range(df.shape[0]):
                                cursor.execute('SELECT COUNT(*) FROM annotation_label WHERE label = %s',
                                               [str(df.loc[ind, 'label'])])
                                num = cursor.fetchone()
                                if num[0] > 0:
                                    message = 'WARNING LABELS FILE - ' + labels[i].name + ' - The label: ' + str(df.loc[ind, 'label']) + ' is already present in the database. It will be ignored.'

                elif labels[i].name.endswith('.json'):
                    # with open(labels[i],'r') as f:
                        d = json.load(labels[i])
                        if 'labels' not in d.keys():
                            message = 'LABELS FILE - ' + labels[i].name + ' - json is not well formatted.'
                            return message

                        if d['labels'] == []:
                            message = 'LABELS FILE - ' + labels[
                                i].name + ' - you must provide at least a label.'
                            return message
                        l = d['labels']
                        if len(l) > len(set(l)):
                            message = 'WARNING LABELS FILE - ' + labels[
                                i].name + ' - the list of labels contains duplicates. They will be ignored.'
                        for ind in range(len(l)):
                            cursor.execute('SELECT COUNT(*) FROM annotation_label WHERE label = %s',
                                           [str(l[ind])])
                            num = cursor.fetchone()
                            if num[0] > 0:
                                message = 'WARNING LABELS FILE - ' + labels[i].name + ' - The label: ' + str(l[ind]) + ' is already present in the database. It will be ignored.'

                elif labels[i].name.endswith('.txt'):
                    # with open(labels[i], 'r') as f:
                        lines = labels[i].readlines()
                        labels_list = []
                        if len(lines) == 0:
                            message = 'LABELS FILE - ' + labels[i].name + ' - you must provide at least a label.'
                            return message
                        for line in lines:
                            line = line.decode('utf-8')
                            if line not in labels_list:
                                labels_list.append(line)
                            else:
                                message = 'WARNING LABELS FILE - ' + labels[
                                    i].name + ' - the list of labels contains duplicates. They will be ignored.'
                        for ind in range(len(labels_list)):
                            cursor.execute('SELECT COUNT(*) FROM annotation_label WHERE label = %s',
                                           [str(labels_list[ind])])
                            num = cursor.fetchone()
                            if num[0] > 0:
                                message = 'WARNING LABELS FILE - ' + labels[i].name + ' - The label: ' + str(labels_list[ind]) + ' is already present in the database. It will be ignored.'
                return message


        elif (len(pubmedfiles) > 0 or len(reports) > 0) and len(topics) > 0 and len(runs) > 0:
            message = ''
            documents_ids = []
            topics_ids = []
            to = UseCase.objects.all().values('name')
            for el in to:
                topics_ids.append(el['name'])
            ids = Report.objects.all().values('id_report')
            for el in ids:
                documents_ids.append(str(el['id_report']))

            for i in range(len(pubmedfiles)):

                # Error if the file is not csv
                if not pubmedfiles[i].name.endswith('csv') and not pubmedfiles[i].name.endswith('json') and not \
                pubmedfiles[i].name.endswith(
                        'txt'):
                    message = 'PUBMED FILE - ' + pubmedfiles[
                        i].name + ' - The file must be .csv or .json or .txt'
                    return message

                if pubmedfiles[i].name.endswith('csv'):
                    try:
                        df = pd.read_csv(pubmedfiles[i])
                        df = df.where(pd.notnull(df), None)
                        df = df.reset_index(drop=True)  # Useful if the csv includes only commas
                    except Exception as e:
                        print(e)
                        message = 'PUBMED FILE - ' + pubmedfiles[
                            i].name + ' - An error occurred while parsing the csv. Check if it is well formatted. Check if it contains as many columns as they are declared in the header.'
                        return message

                    else:
                        # check if colunns are allowed and without duplicates
                        cols = list(df.columns)
                        list_db_col = ['document_id']

                        for el in list_db_col:
                            if el not in cols and el == 'document_id':
                                message = 'PUBMED FILE - ' + pubmedfiles[
                                    i].name + ' - The column: ' + el + ' is missing, please add it.'
                                return message


                        for column in cols:
                            null_val = df[df[column].isnull()].index.tolist()
                            if len(null_val) > 0:
                                message = 'PUBMED FILE - ' + pubmedfiles[
                                    i].name + ' - You did not inserted the ' + column + ' for rows: ' + null_val.split(
                                    ', ')

                        # Check if the csv is empty with 0 rows
                        if df.shape[0] == 0:
                            message = 'PUBMED FILE - ' + pubmedfiles[
                                i].name + ' -  You must provide at least a report.'
                            return message
                        else:
                            # check if columns id_report and language have no duplicates
                            # if 'language' in df:
                            #     df_dup = df[df.duplicated(subset=['document_id', 'language'], keep=False)]
                            # else:
                            df_dup = df[df.duplicated(subset=['document_id'], keep=False)]
                            if df_dup.shape[0] > 0:
                                message = 'WARNING PUBMED FILE - ' + pubmedfiles[
                                    i].name + ' - The rows: ' + str(
                                    df_dup.index.to_list()) + ' are duplicated. The duplicates are ignored.'

                        for ind in range(df.shape[0]):
                            found = False
                            id_report = 'PUBMED_' + str(df.loc[ind, 'document_id'])
                            cursor.execute('SELECT COUNT(*) FROM report WHERE id_report = %s AND institute = %s',
                                           [str(id_report), 'PUBMED'])
                            num = cursor.fetchone()
                            if num[0] > 0:
                                message = 'WARNING PUBMED FILE - ' + pubmedfiles[i].name + ' - The report: ' + str(
                                    id_report) + ' is already present in the database. It will be ignored.'

                            for el in list_db_col:
                                if df.loc[ind, el] is not None:
                                    found = True
                                    break
                            if found == False:
                                message = 'PUBMED FILE - ' + pubmedfiles[i].name + ' -  The report at row ' + str(
                                    ind) + ' has the columns: ' + ', '.join(
                                    list_db_col) + ' empty. Provide a value for at least one of these columns.'
                                return message
                        el = ''

                        if None in df['document_id'].tolist():
                            el = 'institute'

                        if el != '':
                            lista = df[el].tolist()
                            ind = lista.index(None)
                            message = 'PUBMED FILE - ' + pubmedfiles[
                                i].name + ' - The column ' + el + ' is empty at the row: ' + str(ind) + '.'
                            return message

                elif pubmedfiles[i].name.endswith('json'):

                    d = json.load(runs[i])

                    if 'pubmed_ids' not in d.keys():
                        message = 'PUBMED FILE - ' + runs[
                            i].name + ' - json is not well formatted.'
                        return message
                    if d['pubmed_ids'] == []:
                        message = 'PUBMED FILE - ' + runs[
                            i].name + ' - you must provide at least an article id.'
                        break
                    if not isinstance(d['pubmed_ids'], list):
                        message = 'PUBMED FILE - ' + runs[
                            i].name + ' - you must provide at least an article id.'
                        return message

                    if len(d['pubmed_ids']) != len(list(set(d['pubmed_ids']))):
                        message = 'WARNING PUBMED FILE - ' + runs[
                            i].name + ' - some ids seem to be duplicated. They will be ignored.'
                        return message

                    for el in d['pubmed_ids']:
                        id_report = 'PUBMED_' + str(str(el))
                        cursor.execute('SELECT COUNT(*) FROM report WHERE id_report = %s AND institute = %s',
                                       [str(id_report), 'PUBMED'])
                        num = cursor.fetchone()
                        if num[0] > 0:
                            message = 'WARNING PUBMED FILE - ' + pubmedfiles[i].name + ' - The report: ' + str(
                                id_report) + ' is already present in the database. It will be ignored.'

                elif pubmedfiles[i].name.endswith('txt'):

                    lines = pubmedfiles[i].readlines()
                    if len(lines) == 0:
                        message = 'PUBMED FILE - ' + runs[
                            i].name + ' - the file is empty.'
                        return message
                    if len(lines) != len(list(set(lines))):
                        message = 'WARNING PUBMED FILE - ' + runs[
                            i].name + ' - the file contain some duplicates: they will be ignored.'
                    for line in lines:
                        id_report = 'PUBMED_' + str(line.split()[0])
                        cursor.execute('SELECT COUNT(*) FROM report WHERE id_report = %s AND institute = %s',
                                       [str(id_report), 'PUBMED'])
                        num = cursor.fetchone()
                        if num[0] > 0:
                            message = 'WARNING PUBMED FILE - ' + pubmedfiles[i].name + ' - The report: ' + str(
                                id_report) + ' is already present in the database. It will be ignored.'

        # elif len(reports) > 0 and len(runs) > 0 and len(topics) > 0:
        #     message = ''


            for i in range(len(reports)):
                reps = decompress_files([reports[i]])
                for rep in reps:
                    if isinstance(rep, str):
                        rep_name = rep
                        workpath = os.path.dirname(os.path.abspath(__file__))  # Returns the Path your .py file is in
                        rep = os.path.join(workpath, 'static/tmp/' + rep_name)
                    else:
                        rep_name = rep.name
                    if not rep.name.endswith('csv') and not rep_name.endswith('txt') and not rep.name.endswith('json'):
                        message = 'DOCUMENTS FILE - ' + rep_name + ' - The file must be .csv, .json, .txt'
                        return message

                    if rep_name.endswith('csv'):
                        try:
                            df = pd.read_csv(rep)
                            df = df.where(pd.notnull(df), None)
                            df = df.reset_index(drop=True)

                        except Exception as e:
                            message = 'DOCUMENTS FILE - ' + rep_name + ' - An error occurred while parsing the csv. Check if it is well formatted. '
                            return message
                        else:
                            cols = list(df.columns)
                            count = 0
                            list_db_col = ['document_id','language']
                            list_not_db_col = []

                            for el in list_db_col:
                                if el not in cols and el == 'document_id':
                                    message = 'DOCUMENTS FILE - ' + rep_name + ' - The column: ' + str(el) + ' must be present.'
                                    return message

                            for id in list(df.document_id.unique()):
                                # if str(id) in documents_ids:
                                #     json_resp['report_message'] = 'WARNING DOCUMENTS FILE - ' + rep_name + ' - The id: ' + str(id) + ' is duplicated. The duplicates are ignored.'
                                # else:
                                    documents_ids.append(str(id))

                            for el in cols:
                                if el not in list_db_col:
                                    list_not_db_col.append(el)

                            if jsonDispUp is not None and jsonAnnUp is not None:
                                if len(disp) > 0 or len(ann) > 0:
                                    ann_intersect = list(set(ann) & set(list_not_db_col))
                                    for el in list_not_db_col:
                                        if (el not in disp and el not in ann) and (el not in jsonDispUp and el not in jsonAnnUp):
                                            count = count + 1
                                    if count == len(list_not_db_col):
                                        message = 'DOCUMENTS FIELDS - Please, provide at least one field to display in file: ' + \
                                                  rep_name + '. Be careful that if you do not provide one field to annotate you will not be able to perform mention annotation and linking.'
                                        return message
                                    elif len(ann_intersect) == 0 and (jsonAnnUp[0]) == '':
                                        message = 'WARNING DOCUMENTS FIELDS - file: ' + rep_name + ' Please, provide at least one field to annotate if you want to find mentions and perform linking.'

                            if len(list_not_db_col) == 0:
                                message = 'DOCUMENTS FILE - ' + rep_name + ' - You must provide at least one column other than document_id'
                                return message

                            if df.shape[0] == 0:
                                message = 'DOCUMENTS FILE - ' + rep_name + ' -  You must provide at least a report.'
                                return message
                            else:
                                df_dup = df[df.duplicated(subset=['document_id'], keep=False)]
                                if 'language' in df:
                                    df_dup = df[df.duplicated(subset=['document_id','language'], keep=False)]
                                if df_dup.shape[0] > 0:
                                    message = 'WARNING DOCUMENTS FILE - ' + rep_name + ' - The rows: ' + str(
                                        df_dup.index.to_list()) + ' are duplicated. The duplicates are ignored.'

                                for id in list(df.document_id.unique()):
                                    if str(id) in documents_ids:
                                        message = 'WARNING DOCUMENTS FILE - ' + rep_name + ' - The id: ' + str(
                                            id) + ' is duplicated. The duplicates are ignored.'
                                    else:
                                        documents_ids.append(str(id))

                                for ind in range(df.shape[0]):
                                    found = False
                                    if 'language' in df:
                                        language = str(df.loc[ind, 'language'])
                                    else:
                                        language = 'english'

                                    cursor.execute('SELECT COUNT(*) FROM report WHERE id_report = %s AND language = %s',
                                                   [str(df.loc[ind, 'document_id']),language])
                                    num = cursor.fetchone()
                                    if num[0] > 0:
                                            message = 'WARNING DOCUMENTS FILE - ' + rep_name + ' - The report: ' + str(
                                            df.loc[ind, 'document_id']) + ' is already present in the database. It will be ignored.'

                                    for el in list_db_col:
                                        if df.loc[ind, el] is not None:
                                            found = True
                                            break

                                    if found == False:
                                        message = 'DOCUMENTS FILE - ' + rep_name + ' -  The report at row ' + str(
                                            ind) + ' has the column: ' + ', '.join(
                                            list_db_col) + ' empty. '
                                        return message

                                    found = False
                                    count_both = 0
                                    not_none_cols = []

                                    for el in list_not_db_col:
                                        if df.loc[ind, el] is not None:
                                            found = True
                                            not_none_cols.append(el)

                                    if found == False:
                                        message = 'DOCUMENTS FILE - ' + rep_name + ' -  The report at row ' + str(
                                            ind) + ' has the columns: ' + ', '.join(
                                            list_not_db_col) + ' empty. Provide a value for at least one of these columns, or delete this report from the csv file.'
                                        return message

                                    for el in not_none_cols:
                                        if jsonAnnUp is not None and jsonDispUp is not None:
                                            if el not in disp and el not in jsonDispUp and el not in ann and el not in jsonAnnUp:
                                                count_both = count_both + 1

                                        else:
                                            if el not in disp and el not in ann:
                                                count_both = count_both + 1

                                    if count_both == len(not_none_cols):
                                        message = 'WARNING DOCUMENTS FIELDS TO DISPLAY AND ANNOTATE - ' + rep_name + ' -  With the current configuration the report at the row: ' + str(
                                            ind) + ' would not be displayed since the columns to display are all empty for that report.'

                                # for el in df.institute.unique():
                                #     if el.lower() == 'pubmed':
                                #         message = 'REPORTS FILE - ' + reports[
                                #             i].name + ' - calling an institute "PUBMED" is forbidden, please, change the name'
                                #
                                for el in df.document_id:
                                    if el.lower().startswith('pubmed_'):
                                        message = 'DOCUMENTS FILE - ' + rep_name + ' - reports\' ids can not start with "PUBMED_", please, change the name'
                                el = ''
                                if None in df['document_id'].tolist():
                                    el = 'document_id'
                                if 'language' in df:
                                    el = 'language'
                                if el != '':
                                    lista = df[el].tolist()
                                    ind = lista.index(None)
                                    message = 'DOCUMENTS FILE - ' + rep_name + ' - The column ' + el + ' is empty at the row: ' + str(ind) + '.'
                                    return message

                    elif rep_name.endswith('json'):
                        # with open(rep, 'r') as f:
                            d = json.load(rep)
                            if 'collection' not in d.keys():
                                message = 'DOCUMENTS FILE - ' + rep_name + ' - The json is not well formatted.'
                                break
                            exit = False
                            keys_list = []
                            if len(d['collection']) == 0:
                                message = 'DOCUMENTS FILE - ' + rep_name + ' -  You must provide at least a report.'
                                break
                            for document in d['collection']:
                                if 'language' in document.keys():
                                    language = document['language']
                                else:
                                    language = 'english'
                                cursor.execute('SELECT COUNT(*) FROM report WHERE id_report = %s AND language = %s',
                                               [document['document_id'], language])
                                num = cursor.fetchone()
                                if num[0] > 0:
                                    message = 'WARNING REPORT FILE - ' +rep_name + ' - The report: ' + str(
                                        document['document_id']) + ' is already present in the database. It will be ignored.'

                                ind = d['collection'].index(document)
                                if 'document_id' not in document.keys() or document['document_id'] is None:
                                    message = 'DOCUMENTS FILE - ' + rep_name + ' - The ' + str(ind) + ' document does not contain the "document_id" key which is mandatory.'
                                    exit = True
                                    break
                                doc_keys = list(document.keys())
                                if 'language' in list(document.keys()):
                                    doc_keys.remove('language')
                                doc_keys.remove('document_id')
                                is_none = True
                                for key in list(document.keys()):
                                    if key != 'document_id' and key != 'language':
                                        if document[key] is not None:
                                            is_none = False
                                            break
                                if ('document_id' in list(document.keys()) and len(list(document.keys())) == 1) or ('language' in list(document.keys()) and len(list(document.keys())) == 2) or is_none:
                                    message = 'DOCUMENTS FILE - ' + rep_name + ' - The ' + str(ind) + ' document does not contain the document\' s text.'
                                keys_list.extend(list(document.keys()))
                                if str(document['document_id']) in documents_ids:
                                    message = 'WARNING DOCUMENTS FILE - ' + rep_name + ' - The id ' + str(document['document_id']) + ' is duplicated.'
                                else:
                                    documents_ids.append(str(document['document_id']))

                                count_both = 0
                                for el in doc_keys:
                                    if jsonAnnUp is not None and jsonDispUp is not None:
                                        if el not in disp and el not in jsonDispUp and el not in ann and el not in jsonAnnUp:
                                            count_both = count_both + 1

                                    else:
                                        if el not in disp and el not in ann:
                                            count_both = count_both + 1

                                if count_both == len(doc_keys):
                                    message = 'WARNING DOCUMENTS FIELDS TO DISPLAY AND ANNOTATE - ' + reports[
                                        i].name + ' -  With the current configuration the report at the row: ' + str(
                                        ind) + ' would not be displayed since the columns to display are all empty for that report.'
                            if exit == True:
                                break

            if len(topics) > 0:
                for i in range(len(topics)):
                    if not topics[i].name.endswith('csv') and not topics[i].name.endswith('json') and not topics[
                        i].name.endswith('txt'):
                        message = 'TOPIC FILE - ' + topics[i].name + ' - The file must be .csv or .json or .txt'
                        return message
                    if topics[i].name.endswith('csv'):
                        try:
                            df = pd.read_csv(labels[i])
                            df = df.where(pd.notnull(df), None)
                            df = df.reset_index(drop=True)

                        except Exception as e:
                            message = 'TOPIC FILE - ' + topics[
                                i].name + ' - An error occurred while parsing the csv. Check if is well formatted.'
                            pass

                        else:
                            cols = list(df.columns)
                            list_db_col = ['topic_id', 'title', 'description', 'narrative']

                            for el in list_db_col:
                                if el not in cols and el == 'topic_id':
                                    message = 'TOPIC FILE - ' + topics[
                                        i].name + ' - The column: ' + el + ' is not present and it is mandatory.'
                                    return message
                                elif el not in cols:
                                    message = 'WARNING TOPIC FILE - ' + topics[
                                        i].name + ' - The column: ' + el + ' is not present.'

                            for el in cols:
                                if el not in list_db_col:
                                    message = 'TOPIC FILE - ' + topics[
                                        i].name + ' - The column ' + el + ' is not allowed.'
                                    return message

                            for id in list(df.topic_id.unique()):
                                if id in topics_ids:
                                    message = 'WARNING TOPIC FILE - ' + topics[i].name + ' - The topic: ' + str(id) + ' is duplicated. The duplicates are ignored.'
                                else:
                                    topics_ids.append(id)

                            if df.shape[0] == 0:
                                message = 'TOPIC FILE - ' + topics[
                                    i].name + ' - You must provide at least a row.'
                                return message
                            else:
                                # check if columns annotation_label and name have no duplicates
                                df_dup = df[df.duplicated(subset=['topic_id'], keep=False)]
                                if df_dup.shape[0] > 0:
                                    message = 'WARNING TOPIC FILE - ' + topics[
                                        i].name + ' - The rows: ' + str(
                                        df_dup.index.to_list()) + ' are duplicated. The duplicates will be ignored.'

                                el = ''

                                if None in df['topic_id'].tolist():
                                    el = 'topic_id'
                                if el != '':
                                    lista = df[el].tolist()
                                    ind = lista.index(None)
                                    message = 'TOPIC FILE - ' + topics[
                                        i].name + ' - The column ' + el + ' is empty at the row: ' + str(ind) + ' .'
                                    return message

                    elif topics[i].name.endswith('.txt'):
                        arr_to_ret = elaborate_runs(runs)
                        topics_ids = elaborate_TREC_topic_files([], topics[i], 'check')
                        topics_ids = [str(i) for i in topics_ids]
                        if isinstance(topics_ids, list) == False:
                            message = 'TOPIC FILE - ' + topics[
                                i].name + ' - topics are not well formatted.'

                    elif topics[i].name.endswith('.json'):
                        # with open(topics[i], 'r') as f:
                            d = json.load(topics[i])
                            doc_top = []
                            if 'topics' not in d.keys():
                                message = 'TOPIC FILE - ' + topics[
                                    i].name + ' - json is not well formatted.'
                                return message

                            if d['topics'] == []:
                                message = 'TOPIC FILE - ' + labels[
                                    i].name + ' - you must provide at least a label.'
                                return message

                            for topic in d['topics']:
                                ind = d['topics'].index(topic)

                                if 'topic_id' not in topic.keys():
                                    message = 'TOPIC FILE - ' + topics[
                                        i].name + ' - you must provide a topic number in the ' + str(ind) + ' th topic.'
                                    return message
                                doc_top.append(topic['topic_id'])
                                if str(topic['topic_id']) in topics_ids:
                                    message = 'WARNING TOPIC FILE - ' + topics[
                                        i].name + ' - the list of topics contains duplicates. They will be ignored.'
                                else:
                                    topics_ids.append(str(topic['topic_id']))

                            if len(doc_top) > len(set(doc_top)):
                                message = 'WARNING TOPIC FILE - ' + topics[
                                    i].name + ' - the list of topics contains duplicates. They will be ignored.'

            if len(runs) > 0:
                language = 'english'
                for i in range(len(runs)):
                    if not runs[i].name.endswith('csv') and not runs[i].name.endswith('json') and not runs[i].name.endswith('txt'):
                        message = 'RUNS FILE - ' + runs[i].name + ' - The file must be .csv or .json or .txt'
                        break
                    if runs[i].name.endswith('csv'):
                        try:
                            df = pd.read_csv(runs[i])
                            df = df.where(pd.notnull(df), None)
                            df = df.reset_index(drop=True)

                        except Exception as e:
                            message = 'RUNS FILE - ' + runs[
                                i].name + ' - An error occurred while parsing the csv. Check if is well formatted.'
                            return message

                        else:
                            cols = list(df.columns)
                            list_db_col = ['topic_id', 'document_id', 'language']
                            for el in list_db_col:
                                if el not in cols and el != 'language':
                                    message = 'RUNS FILE - ' + runs[
                                        i].name + ' - The column: ' + el + ' is not present and it is mandatory.'
                                    return message

                            for el in cols:
                                if el not in list_db_col:
                                    message = 'RUNS FILE - ' + runs[
                                        i].name + ' - The column ' + el + ' is not allowed.'
                                    return message

                            if df.shape[0] == 0:
                                message = 'RUNS FILE - ' + runs[
                                    i].name + ' - You must provide at least a row.'
                                return message
                            else:
                                # check if columns annotation_label and name have no duplicates
                                df_dup = df[df.duplicated(subset=['topic_id', 'document_id'], keep=False)]
                                if 'language' in df:
                                    df_dup = df[df.duplicated(subset=['topic_id', 'document_id','language'], keep=False)]

                                if df_dup.shape[0] > 0:
                                    message = 'WARNING RUNS FILE - ' + runs[
                                        i].name + ' - The rows: ' + str(
                                        df_dup.index.to_list()) + ' are duplicated. The duplicates will be ignored.'

                                for i in range(df.shape[0]):
                                    doc = str(df.loc[i,'document_id'])
                                    top = str(df.loc[i,'topic_id'])
                                    if 'language' in df:
                                        language = str(df.loc[i,'language'])
                                    report = Report.objects.get(id_report = str(doc),language = language)
                                    topic = UseCase.objects.get(name = str(top))
                                    v = TopicHasDocument.objects.filter(name = topic,id_report = report,language =language)
                                    if v.count() > 0:
                                        message = 'WARNING RUNS FILE - ' + runs[i].name + ' - The topic: ' + str(topic) +' is already associated to the document: ' + str(doc)+ ' it will be ignored.'

                                el = ''
                                # if None in df['usecase'].tolist():
                                #     el = 'usecase'
                                if None in df['topic_id'].tolist():
                                    el = 'topic_id'
                                if None in df['document_id'].tolist():
                                    el = 'document_id'
                                if 'language' in df:
                                    if  None in df['language'].tolist():
                                        el = 'language'
                                if el != '':
                                    lista = df[el].tolist()
                                    ind = lista.index(None)
                                    message = 'RUNS FILE - ' + topics[
                                        i].name + ' - The column ' + el + ' is empty at the row: ' + str(ind) + ' .'
                                    return message

                            tops.extend(df.topic_id.unique())
                            for el in df.topic_id.unique():
                                if el not in topics_ids:
                                    message = 'RUNS FILE - ' + runs[
                                        i].name + ' - The topic: ' + str(el) + ' is not in the provided list of topics.'
                                    return message

                            docs.extend(list(df.document_id.unique()))
                            for el in (df.document_id.unique()):
                                if str(el) not in documents_ids:
                                    message = 'RUNS FILE - ' + runs[
                                        i].name + ' - The document: ' + str(
                                        el) + ' is not in the provided list of documents.'
                                    return message

                    elif runs[i].name.endswith('.json'):
                        # with open(runs[i], 'r') as f:
                        d = json.load(runs[i])

                        if 'run' not in d.keys():
                            message = 'RUNS FILE - ' + runs[
                                i].name + ' - json is not well formatted.'
                            return message

                        if d['run'] == []:
                            message = 'RUNS FILE - ' + runs[
                                i].name + ' - you must provide at least a topic and one or more documents associated.'
                            return message

                        for r in d['run']:
                            ind = d['run'].index(r)
                            tops.append(r['topic_id'])
                            docs.extend(r['documents'])
                            if 'topic_id' not in r.keys():
                                message = 'RUNS FILE - ' + topics[
                                    i].name + ' - you must provide a topic number in the ' + str(
                                    ind) + ' th element.'
                                return message

                            if 'documents' not in r.keys():
                                message = 'RUNS FILE - ' + topics[
                                    i].name + ' - you must provide a topic\'s list for the topic:  ' + str(
                                    r['topic_id']) + '.'
                                return message
                            for el in r['documents']:

                                if isinstance(el,str) or isinstance(el,int):
                                    if Report.objects.filter(id_report=str(el)).exists():
                                        report = Report.objects.get(id_report=str(el), language='english')
                                        topic = UseCase.objects.get(name=str(r['topic_id']))
                                        v = TopicHasDocument.objects.filter(name=topic, id_report=report,
                                                                            language='english')
                                        if v.count() > 0:
                                            message = 'WARNING RUNS FILE - ' + runs[i].name + ' - The topic: ' + str(
                                                topic) + ' is already associated to the document: ' + str(
                                                el) + ' it will be ignored.'
                                elif isinstance(el,dict):
                                    if Report.objects.filter(id_report=str(el['document_id'])).exists():

                                        report = Report.objects.get(id_report=str(el['document_id']), language=el['language'])
                                        topic = UseCase.objects.get(name=str(r['topic_id']))
                                        v = TopicHasDocument.objects.filter(name=topic, id_report=report,
                                                                            language=el['language'])
                                        if v.count() > 0:
                                            message = 'WARNING RUNS FILE - ' + runs[i].name + ' - The topic: ' + str(
                                                topic) + ' is already associated to the document: ' + str(
                                                el['document_id']) + ' it will be ignored.'

                        for el in tops:
                                if str(el) not in topics_ids:
                                    message = 'RUNS FILE - ' + runs[i].name + ' - The topic: ' + str(el) + ' is not in the provided list of topics.'
                                    return message
                        for el in docs:
                            if str(el) not in documents_ids:
                                message = 'RUNS FILE - ' + runs[
                                    i].name + ' - The document: ' + str(
                                    el) + ' is not in the provided list of documents.'
                                return message

                    elif runs[i].name.endswith('.txt'):
                        # with open(runs[i], 'r') as f:
                        lines = runs[i].readlines()
                        tups = []

                        for line in lines:
                            if len(line.split()) == 2:
                                topic = line.split()[0]
                                tops.append(topic)
                                doc = line.split()[1]
                                docs.append(doc)
                                tups.append((topic, doc))
                                report = Report.objects.get(id_report=str(doc), language='english')
                                topic = UseCase.objects.get(name=str(topic))
                                v = TopicHasDocument.objects.filter(name=topic, id_report=report,
                                                                    language='english')
                                if v.count() > 0:
                                    message = 'WARNING RUNS FILE - ' + runs[i].name + ' - The topic: ' + str(
                                        topic) + ' is already associated to the document: ' + str(
                                        doc) + ' it will be ignored.'
                            elif len(line.split()) > 2:  # TREC
                                topic = line.split()[0]
                                tops.append(topic)
                                doc = line.split()[2]
                                tups.append((topic, doc))
                                docs.append(doc)
                                report = Report.objects.get(id_report=str(doc), language='english')
                                topic = UseCase.objects.get(name=str(topic))
                                v = TopicHasDocument.objects.filter(name=topic, id_report=report,
                                                                    language='english')
                                if v.count() > 0:
                                    message = 'WARNING RUNS FILE - ' + runs[i].name + ' - The topic: ' + str(
                                        topic) + ' is already associated to the document: ' + str(
                                        doc) + ' it will be ignored.'
                            else:
                                message = 'RUNS FILE - ' + runs[
                                    i].name + ' - txt file is not well formatted.'
                                return message


                        for el in tops:
                            if el not in topics_ids:
                                message = 'RUNS FILE - ' + runs[
                                    i].name + ' - The topic: ' + str(el) + ' is not in the provided list of topics.'
                                return message
                        for el in docs:
                            if str(el) not in documents_ids:
                                message = 'RUNS FILE - ' + runs[
                                    i].name + ' - The document: ' + str(
                                    el) + ' is not in the provided list of documents.'
                                return message


        if jsonAnn is not None and jsonDisp is not None:
            if type_req == 'json_fields' and len(jsonAnn) == 0 and len(jsonDisp) == 0 and len(ann) == 0:
                message = 'REPORT FIELDS TO ANNOTATE - You must provide at least one field to display and/or one field to display and annotate.'
                return message

            elif type_req == 'json_fields' and len(jsonAnn) == 0:
                message = 'WARNING REPORT FIELDS TO ANNOTATE - ok, but with this configuration you will not be able to perform mention annotation and linking. Please, select also at least a field to annotate if you want to find some mentions and to link them'
                return message

        if type_req == 'labels' and len(labels) == 0:
            message = 'LABELS - Please insert a labels file.'
            return message

        if type_req == 'concepts' and len(concepts) == 0:
            message = 'CONCEPTS - Please insert a concepts file.'
            return message

        if type_req == 'reports' and len(reports) == 0:
            message = 'REPORTS - Please insert a reports file.'
            return message
        if type_req == 'pubmed' and len(pubmedfiles) == 0:
            message = 'PUBMED - Please insert a reports file.'
            return message

        return message

    except (Exception, psycopg2.Error) as e:
        print(e)
        message = 'An error occurred in ' + type_req + ' file(s). Please check if it is similar to the example we provided.'
        return message


def update_db_util(reports,pubmedfiles,labels,concepts,jsondisp,jsonann,jsondispup,jsonannup,jsonall,topics,runs,batch,tf_idf):

    """This method is run after having checked the files inserted for the update. It updates the db."""

    filename = ''
    today = str(date.today())
    error_location = 'database'
    usecases = []
    sem_areas = []
    created_file = False
    cursor = connection.cursor()
    try:
        with transaction.atomic():


            all_fields = []
            fields = []
            fields_to_ann = []
            version = get_version()
            if int(version) != 0:
                json_resp = get_fields_from_json()
                all_fields = json_resp['all_fields']
                fields = json_resp['fields']
                fields_to_ann = json_resp['fields_to_ann']



            if jsonannup != '' or jsondispup != '' or jsonall != '':
                data = {}
                all_fields = []
                fields = []
                fields_to_ann = []
                version = get_version()
                if int(version) != 0:
                    json_resp = get_fields_from_json()
                    all_fields = json_resp['all_fields']
                    fields = json_resp['fields']
                    fields_to_ann = json_resp['fields_to_ann']

                jsondispup = ''.join(jsondispup)
                jsonannup = ''.join(jsonannup)
                jsonall = ''.join(jsonall)
                jsondispup = jsondispup.split(',')
                jsonannup = jsonannup.split(',')
                jsonall = jsonall.split(',')

                for el in jsondispup:
                    if len(el) > 0:
                        if el not in all_fields:
                            all_fields.append(el)
                        if el not in fields:
                            fields.append(el)

                for el in jsonannup:
                    if len(el) > 0:
                        if el not in fields_to_ann:
                            fields_to_ann.append(el)
                        if el not in all_fields:
                            all_fields.append(el)

                for el in jsonall:
                    if el not in all_fields and el:
                        all_fields.append(el)

                data['fields'] = fields
                data['fields_to_ann'] = fields_to_ann
                data['all_fields'] = all_fields
                version = get_version()
                version_new = int(version) + 1
                filename = 'fields' + str(version_new)
                workpath = os.path.dirname(os.path.abspath(__file__))  # Returns the Path your .py file is in
                with open(os.path.join(workpath, '.config_files/data/' + filename + '.json'), 'w') as outfile:
                    json.dump(data, outfile)
                    created_file = True


            if (len(reports) > 0 or len(pubmedfiles) > 0) or len(runs) > 0 or len(topics) > 0:
                language = 'english'
                arr_to_ret = elaborate_runs(runs)
                error_location = 'Topic'
                for topic in topics:
                    if topic.name.endswith('txt'):
                        elaborate_TREC_topic_files(arr_to_ret, topic)
                    elif topic.name.endswith('json'):
                        process_topic_json_file(arr_to_ret, topic)
                    elif topic.name.endswith('csv'):
                        process_topic_csv_file(arr_to_ret, topic)

                error_location = 'Collection'

                for file in reports:
                    reps = decompress_files([file])
                    for f in reps:

                        if isinstance(f, str):
                            file_name = f
                            workpath = os.path.dirname(
                                os.path.abspath(__file__))  # Returns the Path your .py file is in
                            f = os.path.join(workpath, 'static\\tmp\\' + f)
                        else:
                            file_name = f.name
                        if file_name.endswith('json'):
                            find_docs_in_json_collection(arr_to_ret, f)
                        elif file_name.endswith('csv'):
                            find_docs_in_csv_collection(arr_to_ret, f)

                for file in pubmedfiles:
                    find_docs_in_json_pubmed_collection(arr_to_ret, file)

                error_location = 'Runs'
                for el in arr_to_ret:
                    if len(el) == 3:
                        language = el[2]
                    topic = UseCase.objects.get(name=el[0])
                    doc = Report.objects.get(id_report=el[1], language=language)
                    TopicHasDocument.objects.get_or_create(name=topic, language=doc.language, id_report=doc)

            # Popolate the labels table
            if len(labels) > 0:
                labs = []
                error_location = 'Labels'
                for label_file in labels:
                    if label_file.name.endswith('csv'):
                        df_labels = pd.read_csv(label_file)
                        df_labels = df_labels.where(pd.notnull(df_labels), None)
                        df_labels = df_labels.reset_index(drop=True)
                        # df_labels['usecase'] = df_labels['usecase'].str.lower()
                        count_lab_rows = df_labels.shape[0]
                        for i in range(count_lab_rows):
                            label = str(df_labels.loc[i, 'label'])
                            labs.append(label.rstrip())
                    elif label_file.name.endswith('json'):
                        d = json.load(label_file)
                        labels = d['labels']
                        for label in labels:
                            labs.append(label.rstrip())
                    elif label_file.name.endswith('txt'):
                        lines = label_file.readlines()
                        for line in lines:
                            line = line.decode('utf-8')
                            labs.append(line.replace('\n', ''))

                for label in labs:
                    cursor.execute('SELECT * FROM annotation_label')
                    ans = cursor.fetchall()
                    if len(ans) == 0:
                        seq_number = 1
                    else:
                        cursor.execute('SELECT seq_number FROM annotation_label ORDER BY seq_number DESC;')
                        ans = cursor.fetchall()
                        seq_number = int(ans[0][0]) + 1

                    cursor.execute("SELECT * FROM annotation_label WHERE label = %s;",
                                   (str(label),))
                    ans = cursor.fetchall()
                    if len(ans) == 0:
                        cursor.execute("INSERT INTO annotation_label (label,seq_number) VALUES (%s,%s);",
                                       (str(label), int(seq_number)))


            # Popolate the concepts table
            if len(concepts) > 0:
                error_location = 'Concepts'
                for concept_file in concepts:
                    if concept_file.name.endswith('csv'):
                        df_concept = pd.read_csv(concept_file)
                        df_concept = df_concept.where(pd.notnull(df_concept), None)
                        df_concept = df_concept.reset_index(drop=True)
                        # df_concept['usecase'] = df_concept['usecase'].str.lower()

                        # print(df_concept)
                        count_conc_rows = df_concept.shape[0]

                        for i in range(count_conc_rows):
                            df_concept = df_concept.where(pd.notnull(df_concept), None)
                            concept_url = str(df_concept.loc[i, 'concept_url'])
                            concept_name = str(df_concept.loc[i, 'concept_name'])
                            # usecase = str(df_concept.loc[i, 'usecase'])
                            # semantic_area = str(df_concept.loc[i, 'area'])

                            cursor.execute("SELECT concept_url,json_concept FROM concept WHERE concept_url = %s;",
                                           (str(concept_url),))
                            ans = cursor.fetchall()
                            if len(ans) == 0:
                                # json_concept = json.dumps({'provenance': 'admin', 'insertion_author': 'admin'})
                                cursor.execute("INSERT INTO concept (concept_url,name) VALUES (%s,%s);",
                                               (str(concept_url), str(concept_name)))

                            cursor.execute("SELECT * FROM belong_to WHERE concept_url = %s AND name=%s;",
                                           (str(concept_url), 'default_area'))
                            ans = cursor.fetchall()
                            if len(ans) == 0:
                                cursor.execute("INSERT INTO belong_to (concept_url,name) VALUES (%s,%s);",
                                               (str(concept_url), 'default_area'))
                    elif concept_file.name.endswith('json'):

                        d = json.load(concept_file)
                        count_conc_rows = len(d['concepts_list'])
                        for i in range(count_conc_rows):
                            concept_url = str(d['concepts_list'][i]['concept_url'])
                            concept_name = str(d['concepts_list'][i]['concept_name'])
                            # usecase = str(df_concept.loc[i, 'usecase'])
                            # semantic_area = str(df_concept.loc[i, 'area'])

                            cursor.execute("SELECT concept_url,json_concept FROM concept WHERE concept_url = %s;",
                                           (str(concept_url),))
                            ans = cursor.fetchall()
                            if len(ans) == 0:
                                # json_concept = json.dumps({'provenance': 'admin', 'insertion_author': 'admin'})
                                cursor.execute("INSERT INTO concept (concept_url,name) VALUES (%s,%s);",
                                               (str(concept_url), str(concept_name)))

                            cursor.execute("SELECT * FROM belong_to WHERE concept_url = %s AND name=%s;",
                                           (str(concept_url), 'default_area'))
                            ans = cursor.fetchall()
                            if len(ans) == 0:
                                cursor.execute("INSERT INTO belong_to (concept_url,name) VALUES (%s,%s);",
                                               (str(concept_url), 'default_area'))

            if ((jsonann is not None) and (jsonann != '')) or ((jsondisp is not None) and jsondisp != ''):
                data = {}

                jsondisp = ''.join(jsondisp)
                jsonann = ''.join(jsonann)
                jsondisp = jsondisp.split(',')
                jsonann = jsonann.split(',')

                for el in jsondisp:
                    if len(el) > 0:
                        if el not in fields:
                            fields.append(el)
                        if el not in all_fields:
                            all_fields.append(el)
                for el in jsonann:
                    if len(el) > 0:
                        if el not in fields_to_ann:
                            fields_to_ann.append(el)
                        if el not in all_fields:
                            all_fields.append(el)

                data['fields'] = fields
                data['all_fields'] = all_fields
                data['fields_to_ann'] = fields_to_ann
                version = get_version()
                workpath = os.path.dirname(os.path.abspath(__file__))  # Returns the Path your .py file is in
                version_new = int(version) + 1
                filename = 'fields' + str(version_new)
                with open(os.path.join(workpath, '.config_files/data/' + filename + '.json'), 'w') as outfile:
                    json.dump(data, outfile)
                    created_file = True

    except (Exception,psycopg2.IntegrityError) as e:
        print(e)
        # connection.rollback()
        print('rolledback')

        if created_file == True:
            workpath = os.path.dirname(os.path.abspath(__file__))  # Returns the Path your .py file is in
            if filename != '' and filename != 'fields0':
                path = os.path.join(workpath, '.config_files/data/'+filename+'.json')
                os.remove(path)

        json_resp = {'error': 'an error occurred in: ' + error_location + '. The configuration failed.'}
        return json_resp
    else:
        # connection.commit()
        if created_file == True:
            for filen in os.listdir(os.path.join(workpath, 'config_files/data')):
                if filen.endswith('json'):
                    print(filen)
                    if filen != '' and filen != 'fields0.json' and filen != filename + '.json':
                        path = os.path.join(workpath, '.config_files/data/' + filen)
                        os.remove(path)
        if ((jsonann is not None) and (jsonann != '')) or ((jsondisp is not None) and jsondisp != ''):
            outfile.close()
        if tf_idf is not None :
            print(str(tf_idf))
            data = {}
            if int(tf_idf) > 0:
                workpath = os.path.dirname(os.path.abspath(__file__))  # Returns the Path your .py file is in
                path1 = os.path.join(workpath, './config_files/config.json')
                g = open(path1,'r')
                data = json.load(g)
                data['TF-IDF_k'] = tf_idf
                with open(path1, 'w') as f:
                    json.dump(data, f)

                t = UseCase.objects.all()
                cursor = connection.cursor()

                json_to_write = {}
                for top in t:
                    print('topic:'+str(top))
                    json_to_write[top.name] = {}
                    topic = {}
                    corpus = []
                    cursor.execute(
                        "SELECT r.id_report,r.language,r.report_json FROM report as r inner join topic_has_document as t on t.id_report = r.id_report and r.language = t.language where t.name = %s",
                        [str(top.name)])
                    ans = cursor.fetchall()
                    for el in ans:
                        e = json.loads(el[2])
                        r_j1 = {}

                        r_j1['document_id'] = str(el[0])
                        r_j1['text'] = ''
                        for k in e.keys():
                            print(k)
                            print(e[k])
                            if isinstance(e[k], list):
                                e[k] = ', '.join(e[k])
                            if k != 'document_id' and k != 'language' and e[k] is not None:
                                r_j1['text'] = r_j1['text'] + ' ' + e[k]
                        corpus.append(r_j1)
                    topic['title'] = top.title
                    topic['description'] = top.description
                    df_tfidf = gen_tfidf_map(corpus)

                    for el in ans:
                        start = time.time()
                        print('working on ', str(el[0]))
                        e = json.loads(el[2])
                        r_j1 = {}
                        r_j1['document_id'] = str(el[0])
                        r_j1['text'] = ''
                        for k in e.keys():
                            if k != 'document_id' and k != 'language':
                                r_j1['text'] = r_j1['text'] + ' ' + e[k]
                        tfidf_matcher = QueryDocMatcher(topic, r_j1, corpus,df_tfidf)
                        top_k_matching_words = []
                        top_k_matching_words = tfidf_matcher.get_words_to_highlight()

                        # print(top_k_matching_words)

                        # json_val = {}
                        # json_val[str(el[0])] = top_k_matching_words
                        # json_val['words'] = top_k_matching_words
                        json_to_write[top.name][str(el[0])] = top_k_matching_words
                        # print(json_to_write)
                        end = time.time()
                        print('elaborated in '+str(end-start)+' seconds')

            path2 = os.path.join(workpath, './config_files/tf_idf_map.json')
            with open(path2, 'w') as f:
                json.dump(data, f)

        json_resp = {'message': 'Ok'}

        return json_resp




