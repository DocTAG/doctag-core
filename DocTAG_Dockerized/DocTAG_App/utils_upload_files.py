import psycopg2
import re
import json
from DocTAG_App.models import *
import os
import pandas as pd
import numpy
from psycopg2.extensions import register_adapter, AsIs
def addapt_numpy_float64(numpy_float64):
    return AsIs(numpy_float64)
def addapt_numpy_int64(numpy_int64):
    return AsIs(numpy_int64)
register_adapter(numpy.float64, addapt_numpy_float64)
register_adapter(numpy.int64, addapt_numpy_int64)
from django.db.models import Count
from django.db import transaction
import datetime
from DocTAG_App.utils import *


def check_uploaded_files(files):

    """This method checks whether the files uploaded by the user to copy the ground-truths are well formatted"""

    json_resp = {}
    json_resp['message'] = ''
    for i in range(len(files)):
        # Error if the file is not csv
        if not files[i].name.endswith('csv'):
            json_resp['message'] = 'ERROR - ' + files[i].name + ' - The file must be .csv'
            return json_resp

        try:
            df = pd.read_csv(files[i])
            df = df.where(pd.notnull(df), None)
            df = df.reset_index(drop=True)  # Useful if the csv includes only commas
        except Exception as e:
            print(e)
            json_resp['message'] = 'ERROR - ' + files[
                i].name + ' - An error occurred while parsing the csv. Check if it is well formatted. Check if it contains as many columns as they are declared in the header.'
            return json_resp

        else:
            # check if colunns are allowed and without duplicates
            cols = list(df.columns)
            labels = ['username', 'annotation_mode','id_report', 'language','batch', 'institute', 'topic', 'label']
            mentions = ['username','annotation_mode', 'id_report', 'language','batch', 'institute', 'topic','label', 'start','stop','mention_text']
            linking = ['username','annotation_mode', 'id_report', 'language','batch', 'institute', 'topic', 'start', 'stop', 'mention_text','concept_name','concept_url','area']
            concepts = ['username','annotation_mode', 'id_report', 'language','batch', 'institute', 'topic', 'concept_url','concept_name','area']

            if set(cols) != set(labels) and set(cols) != set(mentions) and set(cols) != set(concepts) and set(cols) != set(linking):
                json_resp['message'] = 'ERROR - ' + files[
                    i].name + ' - The set of columns you inserted in the csv does not correspond to those we ask. ' \
                              'Check the examples.'
                return json_resp


            # if 'topic' in cols:
            #     df['topic'] = df['topic'].str.lower()

            # Check if the csv is empty with 0 rows
            if df.shape[0] == 0:
                json_resp['message'] = 'ERROR - ' + files[
                    i].name + ' - You must provide at least a row.'
                return json_resp

    if len(files) > 0:
        if json_resp['message'] == '':
            json_resp['message'] = 'Ok'
    return json_resp


def upload_files(files,user_to,overwrite):

    """This method handles the upload of csv files to copy th annotations from"""

    json_resp = {'message':'Ok'}

    try:
        with transaction.atomic():
            for i in range(len(files)):
                print(files[i].name)
                df = pd.read_csv(files[i])
                df = df.where(pd.notnull(df), None)
                df = df.reset_index(drop=True)  # Useful if the csv includes only commas
                df.sort_values(['id_report','language'])
                cols = list(df.columns)
                labels = ['username', 'annotation_mode', 'id_report', 'language', 'batch', 'institute', 'topic',
                          'label']
                mentions = ['username', 'annotation_mode', 'id_report', 'language', 'batch', 'institute', 'topic',
                            'label', 'start', 'stop', 'mention_text']
                linking = ['username', 'annotation_mode', 'id_report', 'language', 'batch', 'institute', 'topic',
                           'start', 'stop', 'mention_text', 'concept_name', 'concept_url', 'area']
                concepts = ['username', 'annotation_mode', 'id_report', 'language', 'batch', 'institute', 'topic',
                            'concept_url', 'concept_name', 'area']

                for i, g in df.groupby(['id_report','language','topic']):
                    count_rows = g.shape[0]
                    if df.annotation_mode.unique()[0] == 'Manual':
                        a = 'Human'
                    else:
                        a = 'Robot'
                    report_cur = Report.objects.get(id_report = str(g.id_report.unique()[0]), language = g.language.unique()[0])
                    topic = UseCase.objects.get(name = str(g.topic.unique()[0]))
                    anno_mode = NameSpace.objects.get(ns_id =a)
                    g = g.reset_index()
                    action = ''
                    for i in range(count_rows):
                        usecase = str(df.loc[i, 'topic'])
                        usecase_obj = UseCase.objects.get(name=usecase)
                        mode = str(g.loc[i, 'annotation_mode'])
                        id_report = str(g.loc[i, 'id_report'])
                        language = str(g.loc[i, 'language'])
                        institute = str(g.loc[i, 'institute'])
                        user_from = str(g.loc[i, 'username'])
                        if mode == 'Manual':
                            mode = 'Human'
                        elif mode == 'Automatic':
                            mode = 'Robot'
                        username_from = User.objects.get(username=user_from, ns_id=mode)

                        mode = NameSpace.objects.get(ns_id = mode)
                        user = User.objects.get(username=user_to, ns_id=mode)

                        report = Report.objects.get(id_report=id_report, language=language, institute=institute)
                        if set(cols) == set(labels):
                            label = AnnotationLabel.objects.get(label = str(g.loc[i, 'label']))
                            if overwrite == True and GroundTruthLogFile.objects.filter(username=user,
                                                                                             ns_id=mode,name = usecase_obj,
                                                                                             id_report=report,
                                                                                             language=report.language,
                                                                                             gt_type='labels').exists():
                                GroundTruthLogFile.objects.filter(username=user,ns_id=mode,id_report=report,language=report.language,
                                                                  gt_type='labels',name = usecase_obj).delete()
                                Associate.objects.filter(username=user,ns_id=mode,id_report=report,name = usecase_obj,language=report.language).delete()

                            if (overwrite == False and not GroundTruthLogFile.objects.filter(username=user,
                                                                                             ns_id=mode,name = usecase_obj,
                                                                                             id_report=report,
                                                                                             language=report.language,
                                                                                             gt_type='labels').exists()) or overwrite == True:
                                Associate.objects.create(username=user, ns_id=mode, id_report=report, label=label,
                                                         seq_number=label.seq_number,name = usecase_obj,
                                                         language=report.language, insertion_time=Now())
                                action = 'labels'

                        elif set(cols) == set(mentions):

                            mention = Mention.objects.get(id_report = report, language = language, start = int(g.loc[i, 'start']),
                                                          stop = int(g.loc[i, 'stop']))
                            label = AnnotationLabel.objects.get(label = str(g.loc[i, 'label']))
                            if overwrite == True and GroundTruthLogFile.objects.filter(username=user,
                                                                                             ns_id=mode,
                                                                                             id_report=report,name = usecase_obj,
                                                                                             language=report.language,
                                                                                             gt_type='mentions').exists():
                                GroundTruthLogFile.objects.filter(username=user,ns_id=mode,id_report=report,language=report.language,name = usecase_obj,
                                                                  gt_type='mentions').delete()
                                Annotate.objects.filter(username=user,ns_id=mode,id_report=report,name = usecase_obj,language=report.language,label = label,seq_number = label.seq_number).delete()
                            if (overwrite == False and not GroundTruthLogFile.objects.filter(username=user,
                                                                                             ns_id=mode,
                                                                                             id_report=report,name = usecase_obj,
                                                                                             language=report.language,
                                                                                             gt_type='mentions').exists()) or overwrite == True:
                                Annotate.objects.create(username=user, ns_id=mode,name = usecase_obj, id_report=report,start = mention,stop = mention.stop,
                                                            language=report.language,label = label,seq_number = label.seq_number, insertion_time=Now())
                                action = 'mentions'

                        elif set(cols) == set(concepts):

                            concept = Concept.objects.get(concept_url = str(g.loc[i, 'concept_url']))
                            area = SemanticArea.objects.get(name=str(g.loc[i, 'area']))
                            if overwrite == True and GroundTruthLogFile.objects.filter(username=user,
                                                                                             ns_id=mode,name = usecase_obj,
                                                                                             id_report=report,
                                                                                             language=report.language,
                                                                                             gt_type='concepts').exists():
                                GroundTruthLogFile.objects.filter(username=user,ns_id=mode,id_report=report,language=report.language,name = usecase_obj,
                                                                  gt_type='concepts').delete()
                                Contains.objects.filter(username=user,ns_id=mode,topic_name = usecase_obj.name,id_report=report,language=report.language).delete()
                            if (overwrite == False and not GroundTruthLogFile.objects.filter(username=user,
                                                                                             ns_id=mode,name = usecase_obj,
                                                                                             id_report=report,
                                                                                             language=report.language,
                                                                                             gt_type='concepts').exists()) or overwrite == True:
                                Contains.objects.create(topic_name = usecase_obj.name,username = user, ns_id =mode, id_report = report,concept_url = concept,name = area,
                                                               language = report.language,insertion_time = Now())
                                action = 'concepts'
                        elif set(cols) == set(linking):

                            concept = Concept.objects.get(concept_url = str(g.loc[i, 'concept_url']))
                            area = SemanticArea.objects.get(name=str(g.loc[i, 'area']))
                            mention = Mention.objects.get(id_report=report, language=language,start=int(g.loc[i, 'start']),
                                                          stop=int(g.loc[i, 'stop']))
                            from_arr = []
                            to_arr = []
                            for el in Annotate.objects.filter(id_report=report, language=report.language,name = usecase_obj,
                                                              username=username_from, ns_id=mode).values('start',
                                                                                                         'stop'):
                                from_arr.append(el['start'])
                            for el in Annotate.objects.filter(id_report=report, language=report.language,name = usecase_obj,
                                                              username=user, ns_id=mode).values('start', 'stop'):
                                to_arr.append(el['start'])
                            if overwrite == True and set(to_arr) == set(from_arr) and GroundTruthLogFile.objects.filter(username=user,
                                                                                             ns_id=mode,
                                                                                             id_report=report,name = usecase_obj,
                                                                                             language=report.language,
                                                                                             gt_type='concept-mention').exists():
                                GroundTruthLogFile.objects.filter(username=user,ns_id=mode,id_report=report,language=report.language,name = usecase_obj,
                                                                  gt_type='concept-mention').delete()
                                Linked.objects.filter(username=user,ns_id=mode,id_report=report,language=report.language,topic_name = usecase_obj.name).delete()

                            if (overwrite == False and set(to_arr) == set(from_arr) and not GroundTruthLogFile.objects.filter(username=user,
                                                                                             ns_id=mode,
                                                                                             id_report=report,name = usecase_obj,
                                                                                             language=report.language,
                                                                                             gt_type='concept-mention').exists()) or overwrite == True:
                                Linked.objects.create(topic_name = usecase_obj.name,username = user, ns_id = mode, id_report = report,concept_url = concept,name = area,
                                                               language = report.language,start=mention,stop = mention.stop,insertion_time = Now())
                                action = 'concept-mention'
                    if action != '':

                        gt_json = serialize_gt(action, user_to, report_cur.id_report, report_cur.language,
                                               anno_mode,usecase_obj.name)
                        GroundTruthLogFile.objects.create(username=user, ns_id=anno_mode, gt_type=action,
                                                          gt_json=gt_json, insertion_time=Now(),name = usecase_obj,
                                                          id_report=report_cur, language=language)

    except Exception as e:
        print(e)
        json_resp = {'message':e}
    finally:
        return json_resp
