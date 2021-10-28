import psycopg2
import re
import json
from DocTAG_App.models import *
import os
import numpy
import zipfile
import hashlib
from django.db import connection
import pandas as pd
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

from pathlib import Path

def get_user_gt(username,mode,report1,language,action,topic):

    """This method is needed to satisfy GET requests for each task: when this method is called for a specific task,
    report,language the user's annotation is returned."""

    try:
        username = User.objects.get(username=username,ns_id=mode)
        topic_obj = UseCase.objects.get(name=str(topic))
        if action == 'labels':
            labels = Associate.objects.filter(username=username, ns_id=mode, id_report=report1, language=language,name = topic_obj).values(
                'seq_number', 'label')
            json_dict = {}
            json_dict['labels'] = []

            if len(labels) > 0:
                for el in labels:
                    json_val = {}
                    json_val['label'] = (el['label'])
                    json_val['seq_number'] = (el['seq_number'])
                    json_dict['labels'].append(json_val)

            json_dict['labels'] = sorted(json_dict['labels'], key=lambda json: json['seq_number'])
            # print(json_dict['labels'])
            return json_dict

        elif action == 'mentions':
            a = Annotate.objects.filter(username=username, ns_id=mode, id_report=report1, language=language,name = topic_obj).values(
                'start','stop','label','seq_number')
            b = Linked.objects.filter(username=username, ns_id=mode, id_report=report1, language=language,topic_name = topic_obj.name).values(
                'start','stop')
            json_dict = {}
            json_dict['mentions'] = []
            for el in a:
                mention_text = Mention.objects.get(start=int(el['start']), stop=int(el['stop']), id_report=report1,
                                                   language=language)
                json_val = {}
                json_val['start'] = (el['start'])
                json_val['stop'] = (el['stop'])
                json_val['mention_text'] = mention_text.mention_text
                json_val['label'] = el['label']
                json_val['seq_number'] = el['seq_number']
                json_dict['mentions'].append(json_val)
            for el in b:
                mention_text = Mention.objects.get(start=int(el['start']), stop=int(el['stop']), id_report=report1,
                                                   language=language)
                json_val = {}
                json_val['start'] = (el['start'])
                json_val['stop'] = (el['stop'])
                json_val['mention_text'] = mention_text.mention_text
                json_val['label'] = ''
                json_val['seq_number'] = 0
                if el['start'] not in [e['start'] for e in json_dict['mentions']]:
                    json_dict['mentions'].append(json_val)
            return json_dict

        elif action == 'concept-mention':
            associations = Linked.objects.filter(username=username, ns_id=mode, language=language,topic_name = topic_obj.name,
                                                 id_report=report1.id_report).values('name', 'start', 'stop', 'concept_url')
            json_dict = {}
            json_dict['associations'] = []
            for el in associations:
                mention_text = Mention.objects.get(start=int(el['start']), stop=int(el['stop']), id_report=report1,
                                                   language=language)
                json_val = {}
                concept_name = Concept.objects.get(concept_url=el['concept_url'])
                json_val['start'] = (el['start'])
                json_val['stop'] = (el['stop'])
                json_val['mention_text'] = mention_text.mention_text
                json_val['semantic_area'] = el['name']
                json_val['concept_name'] = concept_name.name.replace('\n', '')  # Rimuovo il replace
                json_val['concept_url'] = el['concept_url']
                json_dict['associations'].append(json_val)
            return json_dict

        elif action == 'concepts':
            json_dict = get_contains_records(report=report1, language=language, ns_id=mode, user=username,topic = topic_obj)

            return json_dict

    except Exception as e:
        print(e)


def check_concept_report_existance(report, concept, user, ns_id,semantic_area,language,topic):

    """This method checks whether the user already annotated a concept for a specific report,language,semantic area."""

    check = False
    report = Report.objects.get(id_report=report,language = language)
    user = User.objects.get(username=user,ns_id=ns_id)
    concept = Concept.objects.get(concept_url=concept)
    semantic_area = SemanticArea.objects.get(name=semantic_area)
    rows = Contains.objects.filter(topic_name = topic,id_report = report, language = language,username = user, ns_id=ns_id,concept_url = concept, name = semantic_area)

    if len(rows) > 0:
        print("[ rows >0 ] for (report, concept) : (" + str(report) + ", "+concept.concept_url+")")
        check = True
    else:
        print("[ 0 rows ] for (report, concept) : (" + str(report) + ", "+concept.concept_url+")")

    return check


def populate_contains_table(report, concept, user, ns_id,semantic_area,language,topic):

    """This method creates an entry in contains table for a specific user,concept,semantic area, report, language."""


    report = Report.objects.get(id_report = report,language = language)
    user = User.objects.get(username = user,ns_id=ns_id)
    concept = Concept.objects.get(concept_url = concept)
    semantic_area = SemanticArea.objects.get(name = semantic_area)
    Contains.objects.create(topic_name = topic.name,id_report = report, ns_id=ns_id,username = user,language = language,concept_url = concept, name = semantic_area, insertion_time = Now())
    status = "Ok"
    return status


def get_contains_records(report=None, language = None, concepts=None,ns_id=None, user=None, semantic_area=None,topic = None):

    """This method returns the list of records in contains table for a specific user, language, report semantic area."""

    records = []
    user = User.objects.get(username = user,ns_id = ns_id)
    if report is not None and concepts is not None and user is not None and semantic_area is not None:
        for concept in concepts:
            for record in Contains.objects.filter(id_report=report, language = language, concept_url=concept, username=user,ns_id=ns_id, name=semantic_area,topic_name = topic.name):
                records.append(record)
    elif report is not None and user is not None and semantic_area is not None:
        for record in Contains.objects.filter(id_report=report,language = language, username=user,ns_id=ns_id, name=semantic_area,topic_name = topic.name):
            records.append(record)
    elif report is not None and user is not None:
        recs = Contains.objects.filter(id_report=report, language=language, ns_id=ns_id, username=user,topic_name = topic.name)
        for record in recs:
            records.append(record)


    reports = {}
    # sem_areas = SemanticArea.objects.all()
    cursor = connection.cursor()
    cursor.execute("SELECT b.name FROM concept AS c INNER JOIN belong_to AS b ON b.concept_url = c.concept_url")
    sem_areas = cursor.fetchall()
    for el in sem_areas:
        reports[el[0]] = []
    if (len(records) > 0):
        for index, record in enumerate(records):
            concept = record.concept_url
            semantic_area = record.name
            concept_mod = Concept.objects.get(concept_url=concept.concept_url)

            report_dict = {"concept_url": str(concept.concept_url),
                           "concept_name": str(concept_mod.name),
                           "semantic_area": str(semantic_area.name)}
            reports[semantic_area.name].append(report_dict)

    return reports


def delete_contains_record(report=None, language = None,concept=None,ns_id=None, user=None, semantic_area=None,topic = None):

    """This method deletes one or more records from the table contains."""

    response_dict = {"Error": "Invalid parameters"}

    if report is not None and concept is not None and user is not None and semantic_area is not None:
        if Contains.objects.filter(topic_name = topic,id_report=report, ns_id=ns_id,concept_url=concept,language = language, username=user, name=semantic_area).delete():
            response_dict = {"Success":"(Report: %s, Concept: %s, User: %s, Semantic area: %s) deleted successfully" % (report, concept, user, semantic_area)}
        else:
            error_json = {"Error": "(Report: %s, Concept: %s, User: %s, Semantic area: %s) not deleted" % (report, concept, user, semantic_area)}
            response_dict = error_json
    elif report is not None and language is not None and user is not None:
        if Contains.objects.filter(topic_name = topic.name,id_report=report, language = language,ns_id=ns_id,username=user).delete():
            response_dict = {"Success": "(Report: %s, User: %s) All related records deleted successfully" % (report, user)}
            obj = GroundTruthLogFile.objects.filter(name = topic,id_report=report,ns_id=ns_id,language = language,username=user,gt_type='concepts')
            if obj.exists():
                obj.delete()
        else:
            error_json = {"Error": "(Report: %s, User: %s) related records NOT deleted successfully" % (report, user)}
            response_dict = error_json

    return response_dict

# LABELS FUNCTIONS
def get_labels(usecase):

    """This method returns the list of labels for a specific use case"""

    labels1 = AnnotationLabel.objects.all().values('label','seq_number')
    labels = []
    for e in labels1:
        labels.append((e['label'], e['seq_number']))
    # print(labels)
    return labels


def update_annotation_labels(labels_to_save,user,report1,language,mode,topic):

    """This method updates the associate table: given the list of labels to insert it inserts them in the db."""

    json_response = {'message':'labels updated!'}

    for label in labels_to_save:
        label1 = AnnotationLabel.objects.get(label=label['label'], seq_number=label['seq_number'])
        if label1 is None:
            json_response = {
                'error': 'An error occurred accessing the database, looking for the correct annotation label.'}
            return json_response

        if not Associate.objects.filter(username = user,seq_number=label1.seq_number, label=label1,id_report=report1,language = language,ns_id=mode,name = topic).exists():
            Associate.objects.create(name = topic,username=user, seq_number=label1.seq_number, label=label1, id_report=report1,language = language, insertion_time=Now(),ns_id=mode)
        else:
            json_response = {'message': 'Some labels were already insert in the database. This should not be possible'}

    return json_response


def delete_all_annotation(to_del,user, report1,language,type,mode,topic):

    """This method deletes all the labels from the associate table."""

    a = True
    json_response = {'message':'OK,deletion done.'}
    if len(to_del) > 0:
        ass = Associate.objects.filter(username=user,ns_id=mode, id_report=report1,language = language,name = topic)
        ass.delete()
        # print('Labels deleted with success')
        obj = GroundTruthLogFile.objects.filter(name = topic,username=user,ns_id=mode, id_report=report1, gt_type=type,language = language)
        obj.delete()
        # print('GT deleted with success')

    else:
        json_response = {'message': 'Nothing to delete.'}

    return json_response

# MENTION FUNCTIONS
def delete_all_mentions(user,report1,language,type,mode,topic):

    """This method deletes all the mentions annotated by a user for a specific report. This method also deletes
    linked records associated to that mention. The ground truth are updated in the ground truth log file table"""

    json_response = {'message':'OK,deletion done.'}
    # if len(to_del) > 0:
    ass = Annotate.objects.filter(username=user,ns_id=mode, id_report=report1,language = language,name = topic).values('start','stop','label')
    # print(len(ass))
    topic = UseCase.objects.get(name = topic)
    rem_contains = False

    for el in ass:
        annotation_el = AnnotationLabel.objects.get(label = el['label'])
        mention_el = Mention.objects.get(start = el['start'],stop = el['stop'], id_report = report1,language = language)
# controllo se altri utenti hanno individuato quella mention. Se sì rimuovo solo da annotate. Se no, rimuovo anche da mention

        toDel = Annotate.objects.filter(username=user,ns_id=mode, start=mention_el.start, stop=mention_el.stop,label = annotation_el,
                                        id_report=report1,language = language,name = topic)
        if toDel.exists():
            toDel.delete()

        toDel_Linked = Linked.objects.filter(username=user,ns_id=mode,start=mention_el.start, stop=mention_el.stop,
                                        id_report=report1,language = language, topic_name = topic)
        if toDel_Linked.exists():
            concept_obj = Concept.objects.get(concept_url = toDel_Linked.first().concept_url_id)
            area_obj = SemanticArea.objects.get(name = toDel_Linked.first().name_id)
            contains_obj = Contains.objects.filter(username = user,ns_id=mode,id_report=report1,language = language,concept_url = concept_obj,
                                               name = area_obj,topic_name = topic)
            toDel_Linked.delete()

            if contains_obj.exists():
                contains_obj.delete()
                rem_contains = True
        # print(toDel)

        if toDel.count() > 1 and toDel_Linked.count() > 1 :
            json_response = {'error': 'FATAL ERROR DATABASE'}
            return json_response
    # topic1 = UseCase.objects.get(name = topic)
    if rem_contains == True:
        obj2 = GroundTruthLogFile.objects.filter(name = topic,username=user,ns_id=mode, id_report=report1,language = language, gt_type='concepts')
        if obj2.exists():
            obj2.delete()
            # In this case the ground truth is created again because it may happen that some concepts were added without
            # any associations with a mention
            if Contains.objects.filter(topic_name = topic,username = user,ns_id=mode, id_report = report1,language = language).exists():
                jsonDict = serialize_gt('concepts', user.username, report1.id_report, language,mode,topic)
                GroundTruthLogFile.objects.create(username=user, id_report=report1, language=language,
                                                                gt_json=jsonDict,ns_id=mode,name = topic,
                                                                gt_type='concepts', insertion_time=Now())

    obj = GroundTruthLogFile.objects.filter(username=user,name = topic, id_report=report1,ns_id=mode,language = language, gt_type=type)
    obj1 = GroundTruthLogFile.objects.filter(username=user,name= topic, id_report=report1,ns_id=mode,language = language, gt_type='concept-mention')
    if obj.exists() or obj1.exists():
        if obj.exists():
            obj.delete()
            # print('GT mention deleted with success')
        if obj1.exists():
            obj1.delete()
            # print('GT concept-mention deleted with success')

    else:
         print('nothing to delete')

    return json_response


def update_mentions(mentions,report1,language,user,mode,topic):

    """This method updates the list of mentions associated to a report"""

    json_response = {'message':'Mentions and Ground truth saved'}
    var_link = False
    var_conc = False
    print(mentions)
    topic = UseCase.objects.get(name = topic)
    user_annot = Annotate.objects.filter(username = user,ns_id=mode, language = language, id_report=report1,name = topic)
    for single_ann in user_annot:
        ann_cur = AnnotationLabel.objects.get(label=single_ann.label_id)
        mention_cur = Mention.objects.get(start = int(single_ann.start_id),stop = int(single_ann.stop),id_report = report1,language = language)
        #La mention c'era nella lista precedente ma non nella nuova, è stata rimossa la singola mention
        ment_deleted = True
        for mention in mentions:
            if single_ann.start_id == int(mention['start']) and single_ann.stop == int(mention['stop'] and str(mention['label']) == single_ann.label_id):
                Annotate.objects.filter(username=user, ns_id=mode, start=mention_cur,name = topic,label = ann_cur,seq_number = ann_cur.seq_number,
                                                     stop=mention_cur.stop, language=language, id_report=report1).delete()
                Annotate.objects.create(username=user, ns_id=mode, start=mention_cur,name = topic,label = ann_cur,seq_number = ann_cur.seq_number,
                                                     stop=mention_cur.stop, language=language, id_report=report1,insertion_time=Now())
                ment_deleted = False
        if ment_deleted:
            annotation = Annotate.objects.filter(label = ann_cur,seq_number = ann_cur.seq_number,username = user,name = topic,ns_id=mode,start = mention_cur,stop = mention_cur.stop, language = language, id_report = report1)

            if annotation.exists():
                annotation.delete()
            link = Linked.objects.filter(username = user,topic_name = topic,ns_id=mode,start = mention_cur,stop = mention_cur.stop, language = language, id_report = report1)
            for elem in link:
                conc = Concept.objects.get(concept_url = elem.concept_url_id)
                area = SemanticArea.objects.get(name = elem.name_id)
                conc_obj = Contains.objects.filter(username = user,ns_id=mode, language = language, id_report=report1,concept_url = conc,
                                                   name = area,topic_name = topic)


                if conc_obj.exists():
                    conc_obj.delete()
                    var_conc = True

            if link.exists():
                link.delete()
                var_link = True

    if var_link:
        obj1 = GroundTruthLogFile.objects.filter(username=user,ns_id=mode,id_report=report1,language = language,name = topic, gt_type='concept-mention')
        if obj1.exists():
            obj1.delete()
            if Linked.objects.filter(username = user,ns_id=mode, language = language, id_report = report1,topic_name = topic).exists():
                jsonDict = serialize_gt('concept-mention', user.username, report1.id_report, language,mode,topic)
                c = GroundTruthLogFile.objects.create(username=user,ns_id=mode, id_report=report1, language=language,
                                                      gt_json=jsonDict,name = topic, gt_type='concept-mention',
                                                      insertion_time=Now())

    if var_conc:
        obj1 = GroundTruthLogFile.objects.filter(username=user, ns_id=mode,id_report=report1, language=language,name = topic,
                                                 gt_type='concepts')
        if obj1.exists():
            obj1.delete()
            if Contains.objects.filter(username = user,ns_id=mode, language = language,topic_name = topic, id_report = report1).exists():
                jsonDict = serialize_gt('concepts', user.username, report1.id_report, language,mode,topic)
                c = GroundTruthLogFile.objects.create(username=user,ns_id=mode, id_report=report1, language=language,
                                                      gt_json=jsonDict, gt_type='concepts',topic_name = topic,
                                                      insertion_time=Now())

    for mention in mentions:
        start_char = int(mention['start'])
        end_char = int(mention['stop'])
        mention_text = mention['mention_text']
        label = mention['label']
        if not Mention.objects.filter(start=start_char, stop=end_char,id_report=report1,language = language).exists():
            Mention.objects.create(language = language,start=start_char, stop=end_char, mention_text=mention_text, id_report=report1)

        obj = Mention.objects.get(start=start_char, stop=end_char,id_report=report1, language=language)
        ann = AnnotationLabel.objects.get(label = label)
        if not Annotate.objects.filter(label = ann,seq_number = ann.seq_number, username=user,ns_id=mode,language = language, id_report=report1,start=obj, stop=obj.stop,name = topic).exists() :
            Annotate.objects.create(label = ann,seq_number = ann.seq_number,username=user,ns_id=mode,language = language, id_report=report1,start=obj, stop=obj.stop, name = topic,insertion_time=Now())
        else:
            json_response = {'message':'You tried to save the same element twice. This is not allowed. We saved only once.'}

    return json_response


# def check_mentions_for_linking(mentions, report1,language,user,usecase,mode):
#     json_response = {'message': 'Mentions and Ground truth saved'}
#     # print(mentions)
#     for i in range(len(mentions)):
#         json_val = {}
#         #mention = json.loads(mentions[i])
#         mention = mentions[i]
#         start_char = int(mention['start'])
#         end_char = int(mention['stop'])
#         mention_text = mention['mention_text']
#         mention_el = Mention.objects.get(start= start_char,stop=end_char,id_report = report1,language = language)
#         toDel_Linked = Linked.objects.filter(start=mention_el.start, stop=mention_el.stop,
#                                              id_report=report1, language=language)
#         toDel_anno = Annotate.objects.filter(start=mention_el.start, stop=mention_el.stop,
#                                              id_report=report1, language=language)
#
#         if((not toDel_anno.exists()) and toDel_anno.count() ==1 and toDel_Linked.exists() and toDel_Linked.count() == 1):
#             toDel_Linked.delete()
#             mention_el.delete()
#
#             type = 'concept-mention'
#             if GroundTruthLogFile.objects.filter(username=user,ns_id=mode, id_report=report1, language=language,
#                                                  gt_type=type).exists():
#                 GroundTruthLogFile.objects.filter(username=user,ns_id=mode, id_report=report1, language=language,
#                                                   gt_type=type).delete()
#
#                 jsonDict = serialize_gt(type, usecase, user.username, report1.id_report, language,mode)
#                 GroundTruthLogFile.objects.create(username=user,ns_id=mode, id_report=report1, language=language,
#                                                             gt_json=jsonDict,
#                                                             gt_type=type, insertion_time=Now())
#                 # print('salvo gt per association!')
#                 # print(groundtruth)
#
#         else:
#             json_response = {'message':'nothing to do with associations'}
#
#
#     return json_response

# LINK FUNCTIONS
def delete_all_associations(user, report1,language,type,mode,topic):

    """This method deletes all associations made by a user for a specific report and language."""

    json_response = {'message':'OK,deletion done.'}
    ass = Linked.objects.filter(username=user, id_report=report1,language = language,topic_name = topic.name)
    modifyconc = False
    for association in ass:
        concept = Concept.objects.get(concept_url = association.concept_url_id)
        semarea = SemanticArea.objects.get(name=association.name_id)
        concepts_user = Contains.objects.filter(username = user,ns_id=mode, id_report = report1,language = language, concept_url = concept,
                                                name=semarea,topic_name = topic.name)
        for con in concepts_user:
            if con.concept_url == association.concept_url and con.name == association.name:
                con.delete()
                modifyconc = True

    if modifyconc:
        if GroundTruthLogFile.objects.filter(name = topic,username=user,ns_id=mode, id_report=report1, language=language,
                                             gt_type='concepts').exists():
            GroundTruthLogFile.objects.filter(username=user,name = topic,ns_id=mode, id_report=report1, language=language,
                                              gt_type='concepts').delete()
            if Contains.objects.filter(topic_name = topic,username = user,ns_id=mode, id_report = report1, language = language).exists():
                jsonDict = serialize_gt(type, user.username, report1.id_report, language,mode,topic)
                GroundTruthLogFile.objects.create(name = topic,username=user,ns_id=mode, id_report=report1, language=language,
                                                                gt_json=jsonDict, gt_type='concepts', insertion_time=Now())


    ass.delete()
    # print('Labels deleted with success')
    obj = GroundTruthLogFile.objects.filter(name = topic,username=user,ns_id=mode, id_report=report1, language = language,gt_type=type)
    obj.delete()
    # print('GT deleted with success')
    return json_response


def update_associations(concepts,user,report1,language,mode,topic):

    """This method updates the records in tables: linked, contains. In particular when a concept is linked also the
    contains table is updates"""

    json_response = {'message':'Associations and Ground Truth saved.'}

    modify_con = False
    user_link = Linked.objects.filter(username=user, ns_id=mode,language=language, id_report=report1,topic_name = topic.name)
    for single_link in user_link:
        mention_cur = Mention.objects.get(start=single_link.start_id, stop=single_link.stop, id_report=report1,
                                          language=language)
        sem_area = SemanticArea.objects.get(name=single_link.name_id)
        con = Concept.objects.get(concept_url=single_link.concept_url_id)
        concetto = Contains.objects.filter(username=user,ns_id=mode, language=language, id_report=report1,name = sem_area,concept_url=con,topic_name = topic.name)
        # La mention c'era nella lista precedente ma non nella nuova, è stata rimossa la singola mention
        ass_deleted = True
        a = Linked.objects.filter(concept_url = con,name=sem_area,start = mention_cur,username=user,ns_id = mode,id_report = report1,language = report1.language,topic_name = topic.name)
        if a.exists():
            a.delete()
        for concept in concepts:
            mention_con = Mention.objects.get(start=int(concept['start']), stop=int(concept['stop']), id_report=report1,
                                          language=language)
            sem_area_con = SemanticArea.objects.get(name=concept['semantic_area'])
            con_con = Concept.objects.get(concept_url=concept['concept_url'])

            if mention_con.start == mention_cur.start and mention_con.stop == mention_cur.stop and con.concept_url == con_con.concept_url and sem_area_con.name == sem_area.name:
                ass_deleted = False

        if ass_deleted:
            if concetto.exists():
                concetto.delete()
                modify_con = True

        #single_link.delete()

    for concept1 in (concepts):
        #concept = json.loads(concept1)
        concept = concept1
        area = concept['semantic_area']
        concept_url = concept['concept_url']
        start_char = concept['start']
        end_char = concept['stop']
        obj = Mention.objects.get(start=start_char, stop=end_char, id_report=report1,language = language)
        sem = SemanticArea.objects.get(name=area)
        concept_2 = Concept.objects.get(concept_url=concept_url)
        con = Contains.objects.filter(username = user,ns_id=mode,id_report = report1,language = language, name = sem,concept_url = concept_2,topic_name = topic.name)
        if not con.exists():
            modify_con = True
            Contains.objects.create(username = user,ns_id=mode,id_report = report1,language = language, name = sem, concept_url = concept_2,insertion_time=Now(),topic_name = topic.name)
        if not Linked.objects.filter(username=user,ns_id=mode, id_report=report1, language = language, name=sem, concept_url=concept_2, start=obj, stop=obj.stop,topic_name = topic.name).exists():
             Linked.objects.create(username=user,ns_id=mode, id_report=report1,language = obj.language, insertion_time=Now(), name=sem,
                                concept_url=concept_2, start=obj, topic_name = topic.name,stop=obj.stop)
             # print(len(user_link))
        else:
            json_response = {'message':'You tried to save the same element twice. This is not allowed. We saved it once'}

    if modify_con:
        if GroundTruthLogFile.objects.filter(username=user,ns_id=mode, id_report=report1, language=language,name = topic,
                                             gt_type='concepts').exists():
            GroundTruthLogFile.objects.filter(username=user,ns_id=mode, id_report=report1, language=language,name = topic,
                                              gt_type='concepts').delete()

        jsonDict = serialize_gt('concepts', user.username, report1.id_report, language,mode,topic.name)
        GroundTruthLogFile.objects.create(username=user,ns_id=mode, id_report=report1, language=language,name = topic,
                                                        gt_json=jsonDict,
                                                        gt_type='concepts', insertion_time=Now())
        # print('ok concept updated')
    # print(len(user_link))
    return json_response

# CONTAINS
def get_list_concepts(semantic_area):

    """This method returns the list of concepts related to a semantic area"""

    concepts = BelongTo.objects.filter(name=semantic_area)
    conc = []
    for el in concepts:
        conc.append({'concept_name':el.concept_url.name, 'concept_url':el.concept_url.concept_url, 'semantic_area':el.name.name})
    return conc


def get_concepts_by_usecase_area(usecase,semantic_area,mode):

    """This method returns a list of concepts given a use case and a semantic area"""

    with connection.cursor() as cursor:
        if mode == 'Human':
            to_check = ['Manual and Automatic','Manual']
        else:
            to_check = ['Manual and Automatic','Automatic']

        cursor.execute("SELECT c.concept_url,c.name, b.name FROM concept AS c INNER JOIN belong_to AS b ON b.concept_url = c.concept_url WHERE b.name = %s", [str(semantic_area)])
        rows = cursor.fetchall()
        conc = []
        for el in rows:
            name = el[1]
            if '\n' in el[1]:
                name = el[1].replace('\n','')
            conc.append({'concept_name': name, 'concept_url': el[0],
                         'semantic_area': el[2]})
        return conc

    #return rows
## END


# FUNCTIONS NEEDED
def serialize_gt(gt_type,username,id_report,language,mode,topic):

    """This method serializes a ground truth: it takes the user's labels/mentions/concepts/associations and
    put them into a json object which will be included in ground truth log file table."""

    user = User.objects.get(username = username,ns_id=mode)
    topic = UseCase.objects.get(name = topic)
    report1 = Report.objects.get(id_report = id_report,language = language)


    jsonDict = {}
    # json_rep = report1.report_json
    # jsonDict['report_id_not_hashed'] = json_rep['report_id']
    jsonErr = {'error': 'Errors in the creation of the ground_truth!'}
    jsonDict['username'] = username
    # if mode.ns_id == 'Human':
    #     jsonDict['mode'] = 'Manual'
    # else:
    #     jsonDict['mode'] = 'Automatic'
    jsonDict['language'] = language
    jsonDict['topic_id'] = topic.name
    json_rep = report1.report_json
    jsonDict['id_report'] = id_report
    if 'report_id' in json_rep.keys():
        jsonDict['id_report_not_hashed'] = json_rep['report_id']
    jsonDict['institute'] = report1.institute
    # jsonDict['use_case'] = use_case
    # if gt_type == 'concept-mention':
    #     jsonDict['gt_type'] = 'linking'
    # else:
    jsonDict['gt_type'] = gt_type
    if gt_type == 'concept-mention':
        couples = Linked.objects.filter(topic_name = topic.name,username=user, ns_id=mode,id_report=report1.id_report,language = language).values('start','stop','concept_url', 'name')

        jsonDict['concept-mention_associations'] = []
        for el in couples:
            json_val = {}
            json_val['start'] = el['start']
            json_val['stop'] = el['stop']
            concept = Concept.objects.get(concept_url = el['concept_url'])
            mention = Mention.objects.get(id_report = report1,language = language,start = el['start'],stop=el['stop'])
            mention_textual = mention.mention_text
            mention_textual = re.sub('[^a-zA-Z0-9n\-_/\' ]+', '', mention_textual)
            if language == 'Italian':
                mention_words = mention_textual.split(' ')
                text = []
                for word in mention_words:
                    if "'" in word:
                        word = word.split("'")[1]
                        text.append(word)
                    else:
                        text.append(word)
                mention_textual = ' '.join(text)

            json_val['mention_text'] = mention_textual
            # for k in rep['rep_string'].keys():
            #     if int(rep['rep_string'][k]['start']) <= int(el['start']) and int(rep['rep_string'][k]['end']) >= int(
            #             el['stop']):
            #         json_val['report_field'] = k
            #         break
            json_val['semantic_area'] = el['name']
            json_val['concept_url'] = el['concept_url']
            json_val['concept_name'] = concept.name
            jsonDict['concept-mention_associations'].append(json_val)

        json_object = json.dumps(jsonDict)

        return jsonDict

    elif gt_type == 'concepts':
        concepts1 = Contains.objects.filter(topic_name = topic.name,username=user,ns_id=mode, id_report=report1,language = language).values('concept_url', 'name')
        concepts = []

        concept = {}

        areas = SemanticArea.objects.all().values('name')
        for el in areas:
            concept[el['name']] = []
        for el in concepts1:
            co = Concept.objects.get(concept_url=el['concept_url'])

            #concepts.append((el['concept_url'],co.name))

            name = el['name']
            concept[name].append({'concept_url':el['concept_url'],'concept_name':co.name})
        jsonDict['concepts'] = concept

        json_object = json.dumps(jsonDict)
        return jsonDict



    elif gt_type == 'labels':
        lab1 = Associate.objects.filter(name = topic,username=user,ns_id=mode, id_report=report1,language = language).values('label', 'seq_number')
        lab = []
        jsonDict['labels'] = []
        for el in lab1:
            # print(el['label'])
            lab.append((el['label'], el['seq_number']))

            jsonVal = {}
            # jsonVal['seq_number'] = el['seq_number']
            jsonVal['label'] = el['label'].replace('\n','')
            jsonDict['labels'].append(jsonVal)
        json_object = json.dumps(jsonDict)
        return jsonDict

    elif gt_type =='mentions':
        ment = Annotate.objects.filter(name = topic,username = user,ns_id=mode, id_report = report1.id_report,language = language).values('start','stop','label')
        mentions = []
        jsonDict['mentions'] = []

        for el in ment:

            mention_text = Mention.objects.get(start = int(el['start']),stop = int(el['stop']),id_report = report1,language = language)
            # print(mention_text.mention_text)
            jsonVal = {}
            # for k in rep['rep_string'].keys():
            #     if int(rep['rep_string'][k]['start'])<=int(el['start']) and int(rep['rep_string'][k]['end'])>=int(el['stop']):
            #         jsonVal['report_field'] = k
            #         break
            jsonVal['start'] = el['start']
            jsonVal['stop'] = el['stop']
            jsonVal['label'] = el['stop']
            mention_textual = mention_text.mention_text
            mention_textual = re.sub('[^a-zA-Z0-9n\-_/\' ]+', '', mention_textual)
            if language == 'Italian':
                mention_words = mention_textual.split(' ')
                text = []
                for word in mention_words:
                    if "'" in word:
                        word = word.split("'")[1]
                        text.append(word)
                    else:
                        text.append(word)
                mention_textual = ' '.join(text)
            jsonVal['mention_text'] = mention_textual
            jsonDict['mentions'].append(jsonVal)
        json_object = json.dumps(jsonDict)

        return jsonDict
    else:
        json_object = json.dumps(jsonErr)

        return json_object


def get_report(usecase,language,institute):

    """This method returns an array of tuples: each tuple contains the id and the json object of each report
    belonging to a specific usecase,language and institute."""


   # reports = Report.objects.filter(name = usecase,language = language,institute = institute).values('id_report','report_json')
    cursor = connection.cursor()
    cursor.execute("SELECT id_report, report_json FROM report AS r INNER JOIN topic_has_document AS t ON t.id_report = r.id_report AND r.language = t.language WHERE r.language = %s AND r.institute = %s AND t.name = %s",
                   [str(language),str(institute),str(usecase)])
    reports = cursor.fetchall()
    objects = []
    for report in reports:
        objects.append((report[0], report[1]))
    return objects


def get_last_groundtruth(username,use_case = None,language = None, institute = None,mode=None,batch = None):

    """This method returns the last made by a specific user according to a use case,language,institute and mode."""

    user = User.objects.get(username = username,ns_id=mode)
    usecase = UseCase.objects.get(name=use_case)
    r = TopicHasDocument.objects.filter(language=language, name = usecase).values('id_report')
    ids = []
    for el in r:
        ids.append(el['id_report'])
    # cursor = connection.cursor()
    # cursor.execute("SELECT r.id_report, report_json FROM report AS r INNER JOIN topic_has_document AS t ON t.id_report = r.id_report AND r.language = t.language WHERE r.language = %s AND r.institute = %s AND t.name = %s",
    #                [str(language),str(institute),str(usecase)])
    # rep = cursor.fetchall()
    # ids = []
    # for el in rep:
    #     ids.append(el[0])
    reports = Report.objects.filter(id_report__in = ids,language = language)
    if use_case is not None and language is not None and institute is not None and mode is not None and batch is not None:
        if GroundTruthLogFile.objects.filter(name = usecase,username=user,ns_id=mode).exists():

            gt = GroundTruthLogFile.objects.filter(name = usecase,username=user,ns_id=mode,language = language,id_report__in = reports).order_by('-insertion_time')
            if mode.ns_id == 'Human':
                for groundtruth in gt:
                    gt_json = (groundtruth.gt_json)
                    if(gt_json['institute']==institute and gt_json['topic_id'] == use_case and gt_json['language'] == language):
                        json_response = gt_json
                        #print(gt_json)
                        return json_response
            # elif mode.ns_id == 'Robot':
            #     for groundtruth in gt:
            #         user_rob = User.objects.get(username='Robot_user')
            #         g_rob = GroundTruthLogFile.objects.get(id_report = groundtruth.id_report_id,language = groundtruth.language,ns_id=mode,username=user_rob,gt_type=groundtruth.gt_type)
            #         gt_json = groundtruth.gt_json
            #         if(gt_json['institute']==institute and gt_json['use_case'] == use_case and gt_json['language'] == language and groundtruth.insertion_time != g_rob.insertion_time):
            #             json_response = gt_json
            #             return json_response
                return None
        else: return None

    elif GroundTruthLogFile.objects.filter(name = usecase,username = user).exists():
        gt = GroundTruthLogFile.objects.filter(name = usecase,username = user).order_by('-insertion_time')
        ground_truth = gt.first()
        json_response = ground_truth.gt_json
        return json_response


def get_distinct():

    """This method returns a json object containing three lists of distinct elements: the institutes,the use cases and
    the languages."""

    jsonDict = {}
    language = Report.objects.all().distinct('language')
    languages = []
    for lang in language:
        languages.append(lang.language)
    jsonDict['language'] = languages

    institute = Report.objects.all().distinct('institute')
    institutes = []
    for inst in institute:
        institutes.append(inst.institute)
    jsonDict['institute'] = institutes

    usecase = TopicHasDocument.objects.all().distinct('name')
    usecases = []
    for uc in usecase:
        usecases.append(uc.name_id)
    jsonDict['usecase'] = usecases
    return jsonDict


def get_array_per_usecase(user,mode1):

    """This method returns the stats for each use case related to a specific user"""

    array_tot = {}
    array_tot_percent = {}

    types = ['labels','mentions','concepts','concept-mention']
    usecase = TopicHasDocument.objects.all().distinct('name')

    if mode1 == 'Human':
        usecases = []
        for uc in usecase:
            usecases.append(uc.name_id)

        # Subdivided for each usecase
        for usecase in usecases:
            array_stats = {}
            array_stats_percent = {}
            use_obj = UseCase.objects.get(name=usecase)
            cursor = connection.cursor()
            cursor.execute(
                "SELECT r.id_report, report_json FROM report AS r INNER JOIN topic_has_document AS t ON t.id_report = r.id_report AND r.language = t.language WHERE r.institute != %s AND t.name = %s",
                [str('PUBMED'), str(usecase)])
            rep = cursor.fetchall()

            #count_per_usecase = Report.objects.filter(name=use_obj).exclude(institute = 'PUBMED')
            array_stats['all_reports'] = len(rep)
            array_stats_percent['all_reports'] = 100

            count_tot = 0
            if len(rep) > 0:
                with connection.cursor() as cursor:
                    for type in types:
                        cursor.execute(
                            "SELECT COUNT(*) FROM report AS r INNER JOIN ground_truth_log_file AS g ON r.id_report = g.id_report AND r.language = g.language WHERE g.name = %s AND username = %s AND gt_type = %s AND ns_id = %s AND institute != %s;",
                            [str(usecase), str(user.username), type, mode1,'PUBMED'])
                        count = cursor.fetchone()
                        count_gt = count[0]
                        count_tot += count_gt
                        array_stats[type] = count_gt
                        array_stats_percent[type] = int((count_gt * 100) / len(rep))

            array_tot[usecase] = array_stats
            array_tot_percent[usecase] = array_stats_percent

    elif mode1 == 'Robot':
        with connection.cursor() as cursor:
            """all_rep are all the reports such that have an automatic gt created."""

            usecases = []
            for uc in usecase:
                usecases.append(uc.name_id)

            for usecase in usecases:
                # print(usecase)
                array_stats = {}
                array_stats_percent = {}

                count_tot = 0
                cursor.execute(
                    "SELECT COUNT(DISTINCT(r.id_report,r.language)) FROM report AS r INNER JOIN ground_truth_log_file AS g ON r.id_report = g.id_report AND r.language = g.language WHERE r.name = %s AND username = %s AND ns_id = %s AND institute != %s;",
                    [str(usecase), 'Robot_user', mode1,'PUBMED'])
                count = cursor.fetchone()
                count_rep = count[0]
                array_stats['all_reports'] = count_rep  # all reports auto annotated for a usecase
                array_stats_percent['all_reports'] = 100  # all reports auto annotated for a usecase
                if count_rep > 0:
                    for type in types:
                        cursor.execute(
                            "SELECT COUNT(*) FROM report AS r INNER JOIN ground_truth_log_file AS gt ON r.id_report = gt.id_report AND r.language = gt.language INNER JOIN ground_truth_log_file AS gtt ON gtt.id_report = gt.id_report AND gtt.language = gt.language AND gtt.gt_type = gt.gt_type WHERE gtt.username=%s AND gt.username=%s AND r.name = %s AND gt.ns_id=%s AND gt.gt_type = %s AND gtt.insertion_time != gt.insertion_time AND institute != %s;",
                            ['Robot_user', str(user.username), usecase, mode1, type,'PUBMED'])
                        gt_count = cursor.fetchone()[0]
                        count_tot += gt_count
                        array_stats[type] = gt_count
                        array_stats_percent[type] = int((gt_count * 100) / count_rep)

                array_tot[usecase] = array_stats
                array_tot_percent[usecase] = array_stats_percent


    to_ret = {}
    to_ret['original'] = array_tot
    to_ret['percent'] = array_tot_percent
    return to_ret


def get_array_per_usecase_PUBMED(user,mode1):

    """This method returns the stats for each use case related to a specific user"""

    array_tot = {}
    array_tot_percent = {}
    usecase = TopicHasDocument.objects.all().distinct('name')
    types = ['labels','mentions','concepts','concept-mention']
    if mode1 == 'Human':
        usecases = []
        for uc in usecase:
            usecases.append(uc.name_id)

        for usecase in usecases:
            # print(usecase)
            array_stats = {}
            array_stats_percent = {}
            us = UseCase.objects.get(name=usecase)
            cursor = connection.cursor()
            cursor.execute(
                "SELECT * FROM report AS r INNER JOIN topic_has_document AS t ON t.id_report = r.id_report AND r.language = t.language WHERE r.institute = %s AND t.name = %s",
                [str('PUBMED'), str(usecase)])
            all_rep = cursor.fetchall()
            # all_rep = Report.objects.filter(name=us,institute = 'PUBMED')
            array_stats['all_reports'] = len(all_rep)
            array_stats_percent['all_reports'] = 100
            if len(all_rep) > 0:
                count_tot = 0
                with connection.cursor() as cursor:
                    for type in types:
                        cursor.execute(
                            "SELECT COUNT(*) FROM report AS r INNER JOIN ground_truth_log_file AS g ON r.id_report = g.id_report AND r.language = g.language and g.name = t.name WHERE t.name = %s AND username = %s AND gt_type = %s AND ns_id = %s AND institute = %s;",
                            [str(usecase), str(user.username), type, mode1,'PUBMED'])
                        count = cursor.fetchone()
                        count_gt = count[0]
                        count_tot += count_gt
                        array_stats[type] = count_gt
                        array_stats_percent[type] = int((count_gt * 100) / all_rep.count())

            array_tot[usecase] = array_stats
            array_tot_percent[usecase] = array_stats_percent

    elif mode1 == 'Robot':
        with connection.cursor() as cursor:
            usecases = []
            for uc in usecase:
                usecases.append(uc.name_id)
            for usecase in usecases:
                array_stats = {}
                array_stats_percent = {}
                count_tot = 0
                cursor.execute(
                    "SELECT COUNT(DISTINCT(r.id_report,r.language)) FROM report AS r INNER JOIN ground_truth_log_file AS g ON r.id_report = g.id_report AND r.language = g.language WHERE r.name = %s AND username = %s AND ns_id = %s AND institute = %s;",
                    [str(usecase), 'Robot_user', mode1,'PUBMED'])
                count = cursor.fetchone()
                count_rep = count[0]
                array_stats['all_reports'] = count_rep  # all reports auto annotated for a usecase
                array_stats_percent['all_reports'] = 100  # all reports auto annotated for a usecase
                if count_rep > 0 :
                    for type in types:
                        cursor.execute(
                            "SELECT COUNT(*) FROM report AS r INNER JOIN ground_truth_log_file AS gt ON r.id_report = gt.id_report AND r.language = gt.language INNER JOIN ground_truth_log_file AS gtt ON gtt.id_report = gt.id_report AND gtt.language = gt.language AND gtt.gt_type = gt.gt_type WHERE gtt.username=%s AND gt.username=%s AND r.name = %s AND gt.ns_id=%s AND gt.gt_type = %s AND gtt.insertion_time < gt.insertion_time AND institute = %s;",
                            ['Robot_user', str(user.username), usecase, mode1, type,'PUBMED'])
                        gt_count = cursor.fetchone()[0]
                        count_tot += gt_count
                        array_stats[type] = gt_count
                        array_stats_percent[type] = int((gt_count * 100) / count_rep)

                array_tot[usecase] = array_stats
                array_tot_percent[usecase] = array_stats_percent

    to_ret = {}
    to_ret['original'] = array_tot
    to_ret['percent'] = array_tot_percent
    return to_ret


# def get_labels_exa_count():
#
#     """This method returns the number of labels automatically inserted those needed in automatic annotations"""
#
#     workpath = os.path.dirname(os.path.abspath(__file__))  # Returns the Path your .py file is in
#     with open(os.path.join(workpath, 'automatic_annotation/db_examode_data/examode_db_population.json'),
#               'r') as outfile:
#         data = json.load(outfile)
#         usecases = data['labels'].keys()
#         count = 0
#         for el in usecases:
#             count += len(data['labels'][el])
#         return count 94253693


def get_presence_exa_concepts():

    """This method returns a list with the usecases which do not belong to EXAMODE"""

    usecases = UseCase.objects.all()
    arr_to_ret = []
    # for el in usecases:
    #     if el.name.lower() in ['colon', 'lung', 'uterine cervix']:
    #         use_concept = True
    #         if not ConceptHasUc.objects.filter(name=el).exists():
    #             if el.name not in arr_to_ret:
    #                 arr_to_ret.append(el.name)
    #         else:
    #             with connection.cursor() as cursor:
    #                 cursor.execute(
    #                     "SELECT c.annotation_mode FROM concept AS c INNER JOIN concept_has_uc AS u ON c.concept_url = u.concept_url INNER JOIN belong_to AS b ON b.concept_url = c.concept_url WHERE u.name = %s",
    #                     [str(el.name)])
    #                 rows = cursor.fetchall()
    #                 for row in rows:
    #                     if 'Automatic' in row[0]:
    #                         use_concept = False
    #                         break
    #             if use_concept:
    #                 if el.name not in arr_to_ret:
    #                     arr_to_ret.append(el.name)
    return arr_to_ret


def get_presence_exa_labels():

    """This method returns a list with the usecases which do not belong to EXAMODE"""

    usecases = UseCase.objects.all()
    arr_to_ret = []
    for el in usecases:
        if el.name.lower() in ['colon', 'lung', 'uterine cervix']:
            if not AnnotationLabel.objects.filter(name=el,annotation_mode__in=['Manual and Automatic','Automatic']).exists():
                if el.name not in arr_to_ret:
                    arr_to_ret.append(el.name)

    return arr_to_ret


def get_keys_and_uses_csv(reports):

    """This method returns the distinct keys contained in reports files and a list of usecases (those where automatic
    annotation can be applied)"""

    keys = []
    final_uses = []
    uses = []
    col_list = ['document_id', 'ID']
    for report in reports:
        if isinstance(report, str):
            workpath = os.path.dirname(os.path.abspath(__file__))
            report_name = os.path.join(workpath,'static/tmp/'+report)
            report = report_name
            if report.endswith('json'):
                report = open(report,'r')
        else:
            report_name = report.name

        if report_name.endswith('csv'):
            try:
                    # return keys
                df = pd.read_csv(report)
                df = df.where(pd.notnull(df), None)
                df = df.reset_index(drop=True)
            except Exception as e:
                print(e)
                return keys
            else:
                for col in df:
                    if col not in col_list and col not in keys:
                        keys.append(col.replace(' ','_'))

        elif report_name.endswith('json'):
            # with open(report,'r') as f:
                data = json.load(report)
                docs = data['collection']
                keys = []
                for doc in docs:
                    k = list(doc.keys())
                    k.remove('document_id')
                    keys.extend(k)
                keys = list(set(keys))



    return keys,uses,final_uses


# function used when it is needed to update fields. In this case they are taken from the json file.
def get_keys_csv_update(reports):

    """This method returns the list of keys never seen in the reports inserted to update the db and the usecases whose
    examode concepts have not been loaded yet"""

    keys,uses,final_uses = get_keys_and_uses_csv(reports)
    keys_to_ret = []
    workpath = os.path.dirname(os.path.abspath(__file__))  # Returns the Path your .py file is in
    path = os.path.join(workpath, 'config_files/data/')
    search_dir = path
    os.chdir(search_dir)
    files = filter(os.path.isfile, os.listdir(search_dir))
    files = [os.path.join(search_dir, f) for f in files]  # add path to each file
    files.sort(key=lambda x: os.path.getmtime(x),reverse=True)
    json_file = open(files[0], 'r')
    data = json.load(json_file)
    all = data['all_fields']
    for el in keys:
        if el not in all:
            keys_to_ret.append(el)

    return keys_to_ret,uses


def get_fields_from_json():

    """This method returns respectively the fields to display, to annotate and all the fields (together with those to
    hide"""

    json_resp = {}
    workpath = os.path.dirname(os.path.abspath(__file__))  # Returns the Path your .py file is in
    path = os.path.join(workpath, 'config_files/data/')
    search_dir = path
    os.chdir(search_dir)
    files = filter(os.path.isfile, os.listdir(search_dir))
    files = [os.path.join(search_dir, f) for f in files]  # add path to each file
    files.sort(key=lambda x: os.path.getmtime(x),reverse=True)
    if User.objects.filter(profile='Admin').exists() == False:
        json_file = open(files[-1], 'r')
        # print(files[-1])
        # for filename in os.listdir(path):
        #     if filename != 'fields0.json' and filename.endswith('json') and filename != files[-1]:
        #         os.remove(filename)
    else:
        json_file = open(files[0], 'r')

    data = json.load(json_file)
    # print(data)
    json_resp['fields'] = data['fields']
    json_resp['fields_to_ann'] = data['fields_to_ann']
    json_resp['all_fields'] = data['all_fields']

    # ADDED 06092021
    # json_resp['fields'].extend(['volume','authors','journal','year'])
    # json_resp['fields_to_ann'].extend(['abstract','title'])
    # json_resp['all_fields'].extend(['volume','authors','journal','year','abstract','title'])
    # json_resp['fields'] = list(set(json_resp['fields']))
    # json_resp['all_fields'] = list(set(json_resp['all_fields']))
    # json_resp['fields_to_ann'] = list(set(json_resp['fields_to_ann']))
    return json_resp


def get_fields_from_json_configuration(usecase,institute,language):

    """This method returns the list fields to display, annotate and all the fields given a specific configuration"""

    json_resp1 = get_fields_from_json()
    json_resp = {}
    json_resp['fields'] = []
    json_resp['fields_to_ann'] = []
    json_resp['all_fields'] = []
    #reports = Report.objects.filter(name=usecase,institute = institute, language = language)
    cursor = connection.cursor()
    cursor.execute(
        "SELECT r.id_report FROM report AS r INNER JOIN topic_has_document AS t ON t.id_report = r.id_report AND r.language = t.language WHERE r.language = %s AND r.institute = %s AND t.name = %s",
        [str(language),str(institute), str(usecase)])
    all_rep = cursor.fetchall()
    ids = []
    for rep in all_rep:
        ids.append(rep[0])
    reports = Report.objects.filter(id_report__in = ids,language = language)
    for report in reports:
        rep = report.report_json
        for key in rep.keys():
            if key in json_resp1['fields']:
                if key not in json_resp['fields']:
                    json_resp['fields'].append(key)
                    json_resp['all_fields'].append(key)
            elif key in json_resp1['fields_to_ann']:
                if key not in json_resp['fields_to_ann']:
                    json_resp['fields_to_ann'].append(key)
                    json_resp['all_fields'].append(key)
            elif key in json_resp1['all_fields']:
                if key not in json_resp['all_fields']:
                    json_resp['all_fields'].append(key)

    return json_resp


def get_version():

    """This method returns the version of the fields file where the fields to display and annotate are stored"""

    workpath = os.path.dirname(os.path.abspath(__file__))  # Returns the Path your .py file is in
    path = os.path.join(workpath, 'config_files/data')
    search_dir = path
    os.chdir(search_dir)
    files = filter(os.path.isfile, os.listdir(search_dir))
    files = [os.path.join(search_dir, f) for f in files]  # add path to each file
    files.sort(key=lambda x: os.path.getmtime(x), reverse=True)
    name = (os.path.splitext(files[0])[0])
    version = name.split('fields')[1]
    # print(version)
    return version


def report_get_start_end(json_keys,json_keys_to_ann,report,language):

    """This method returns a json object: for each key of the json report it is returned the key's textual value of
    the field, the start char in the json report considered as string and the stop one."""

    json_dict = {}
    count_words = 0
    count_tot_words = 0

    json_dict['rep_string'] = {}
    report_json = Report.objects.get(id_report=report, language=language)
    report_json = report_json.report_json
    report_string = json.dumps(report_json)
    # print(report_string)
    try:
        for key in json_keys:
            # print(report_json[key])
            if (report_json.get(key) is not None and report_json.get(key) != ""):
                element = report_json[key]
                element_1 = json.dumps(element)
                if element_1.startswith('"') and element_1.endswith('"'):
                    element_1 = element_1.replace('"', '')

                before_element = report_string.split(key)[0]
                after_element = report_string.split(key)[1]
                until_element_value = len(before_element) + len(key) + len(after_element.split(str(element_1))[0])
                start_element = until_element_value + 1
                end_element = start_element + len(str(element_1)) - 1
                element = {'text': element, 'start': start_element, 'end': end_element}
                json_dict['rep_string'][key] = element

        # print(json_keys_to_ann)
        for key in json_dict['rep_string'].keys():
            if key in json_keys_to_ann:
                element = json_dict['rep_string'][key]
                # print(element)
                text = str(element['text'])
                count = text.split(' ')
                count_words = count_words + len(count)
            if key in json_keys:
                element = json_dict['rep_string'][key]
                # print(element)
                text = str(element['text'])
                count = text.split(' ')
                count_tot_words = count_tot_words + len(count)

        # print(count_words)

    except Exception as error:
        print(error)
        pass
    json_dict['final_count'] = count_words
    json_dict['total_count'] = count_tot_words
    # print(count_words)
    return json_dict


# update anche dopo configurazione!!!
# def get_fields_extractable(configuration_status):
#
#     """This method creates or updates the file where the fields used to automatically extract concepts are stored."""
#
#     workpath = os.path.dirname(os.path.abspath(__file__))  # Returns the Path your .py file is in
#     keys_to_filter = ['institute','id_report','language','usecase',
#                       'abstract','title','volume','year','journal','authors']
#     with open(os.path.join(workpath, './automatic_annotation/db_examode_data/examode_db_population.json'), 'r') as f:
#         data = json.load(f)
#         arr_extract = list(data['labels'].keys())
#     f.close()
#     usecases = UseCase.objects.all()
#     json_to_ret = {}
#     if configuration_status == 'configure':
#
#         json_to_ret['total_fields'] = {}
#         json_to_ret['extract_fields'] = {}
#
#         for el in usecases:
#             if el.name.lower() in arr_extract:
#                 json_to_ret['total_fields'][el.name.lower()] = []
#                 json_to_ret['extract_fields'][el.name.lower()] = []
#                 new_chiavi = []
#                 #reports_use = Report.objects.filter(name=el)
#                 cursor = connection.cursor()
#                 cursor.execute(
#                     "SELECT id_report FROM report AS r INNER JOIN topic_has_document AS t ON t.id_report = r.id_report AND r.language = t.language WHERE  t.name = %s",
#                     [ str(el)])
#                 all_rep = cursor.fetchall()
#                 ids = []
#                 for el in all_rep:
#                     ids.append(el[0])
#                 reports_use = Report.objects.filter(id_report__in = ids)
#                 for report in reports_use:
#                     json_rep = report.report_json
#                     chiavi = json_rep.keys()
#                     for k in chiavi:
#                         if k not in keys_to_filter and k not in new_chiavi:
#                             new_chiavi.append(k)
#                 json_to_ret['total_fields'][el.name.lower()] = new_chiavi
#
#     elif configuration_status == 'update':
#         with open(os.path.join(workpath, './automatic_annotation/auto_fields/auto_fields.json'), 'r') as use_outfile:
#             json_to_ret = json.load(use_outfile)  # LISTA CAMPI PER ESTRAZIONE
#         for el in usecases:
#             el = el.name
#             if el in arr_extract:
#                 if el not in json_to_ret['total_fields'].keys() and el not in json_to_ret['extract_fields'].keys():
#                     json_to_ret['total_fields'][el] = []
#                     json_to_ret['extract_fields'][el] = []
#                 cursor = connection.cursor()
#                 cursor.execute(
#                     "SELECT id_report FROM report AS r INNER JOIN topic_has_document AS t ON t.id_report = r.id_report AND r.language = t.language WHERE  t.name = %s",
#                     [ str(el)])
#                 all_rep = cursor.fetchall()
#                 ids = []
#                 for el in all_rep:
#                     ids.append(el[0])
#                 reports_use = Report.objects.filter(id_report__in = ids)
#                 #reports_use = Report.objects.filter(name=el)
#                 for report in reports_use:
#                     json_rep = report.report_json
#                     chiavi = json_rep.keys()
#                     for k in chiavi:
#                         if k not in json_to_ret['total_fields'][el] and k not in keys_to_filter:
#                             json_to_ret['total_fields'][el].append(k)
#
#     with open(os.path.join(workpath, './automatic_annotation/auto_fields/auto_fields.json'), 'w') as use_outfile:
#         json.dump(json_to_ret,use_outfile)
#     use_outfile.close()


# def check_user_agent_gt_presence(username,usecase):
#
#     """This method returns the number of reports which have been automatically annotated by the robot user for a
#      specific use case and the corresponding """
#
#     with connection.cursor() as cursor:
#         cursor.execute(
#             "SELECT COUNT(*) FROM report AS r INNER JOIN ground_truth_log_file AS g ON g.id_report = r.id_report AND g.language = r.language WHERE r.name = %s AND g.ns_id = %s AND g.username = %s;",
#             [str(usecase),'Robot', username])
#         groundTruths = cursor.fetchone()[0]
#         cursor.execute(
#             "SELECT COUNT(*) FROM report AS r INNER JOIN ground_truth_log_file AS g ON g.id_report = r.id_report AND g.language = r.language WHERE r.name = %s AND g.ns_id = %s AND g.username = %s;",
#             [str(usecase),'Robot', 'Robot_user'])
#         groundTruths1 = cursor.fetchone()[0]
#
#     return groundTruths,groundTruths1


def copy_rows(use_case,user_from,user_to,overwrite = None):

    """This method copies the annotations performed by the robot: the automatic annotations are copied and they can be
    considered as done by the user whose name space is Robot. The user can modify them and check the auto annotations."""


    try:
        with transaction.atomic():
            with connection.cursor() as cursor:
                cursor.execute("SELECT g.username,g.id_report,g.language,g.label,g.seq_number,g.insertion_time,g.ns_id,g.name FROM report AS r INNER JOIN associate AS g ON r.id_report = g.id_report AND r.language = g.language WHERE g.name = %s AND g.username = %s;",
                    [str(use_case), str(user_from)])
                rows_asso = cursor.fetchall()

                for row in rows_asso:
                    mode = NameSpace.objects.get(ns_id = row[6])
                    username = User.objects.get(username=user_to, ns_id=mode)
                    report = Report.objects.get(id_report=row[1], language=row[2])
                    topic = UseCase.objects.get(name = row[7])
                    if overwrite == True and GroundTruthLogFile.objects.filter(name = topic,username=username,ns_id=mode,id_report=report,language=report.language,gt_type='labels').exists():
                        GroundTruthLogFile.objects.filter(username=username, ns_id=mode, id_report=report,
                                                          language=report.language,name = topic,
                                                          gt_type='labels').delete()
                        Associate.objects.filter(username=username, ns_id=mode, id_report=report,name = topic,
                                                 language=report.language).delete()
                for row in rows_asso:
                    mode = NameSpace.objects.get(ns_id=row[6])
                    username = User.objects.get(username=user_to, ns_id=mode)
                    report = Report.objects.get(id_report=row[1], language=row[2])
                    label = AnnotationLabel.objects.get(seq_number=row[4], label=row[3])
                    topic = UseCase.objects.get(name=row[7])

                    if (overwrite == False and not GroundTruthLogFile.objects.filter(username=username, ns_id=mode,name = topic,
                                                     id_report=report, language=row[2],gt_type='labels').exists()) or overwrite == True or user_from == 'Robot_user':

                        Associate.objects.create(username=username, ns_id=mode, insertion_time=row[5], label=label,name = topic,
                                                 seq_number=row[4],id_report=report, language=row[2])

                cursor.execute(
                    "SELECT g.insertion_time,g.gt_json,g.id_report,g.language,g.ns_id,g.name FROM report AS r INNER JOIN ground_truth_log_file AS g ON r.id_report = g.id_report AND r.language = g.language WHERE  g.name = %s AND g.username = %s AND gt_type = %s;",
                    [str(use_case), str(user_from), 'labels'])
                rows_gt_lab = cursor.fetchall()
                for row in rows_gt_lab:
                    mode = NameSpace.objects.get(ns_id=row[4])
                    username = User.objects.get(username=user_to, ns_id=mode)
                    report_gt = Report.objects.get(id_report = row[2], language = row[3])
                    topic = UseCase.objects.get(name = row[5])

                    if (overwrite == False and not GroundTruthLogFile.objects.filter(username=username, ns_id=mode,name = topic,
                                                     id_report=report_gt, language=report_gt.language,gt_type = 'labels').exists()) \
                            or overwrite == True or user_from == 'Robot_user':
                        gt = json.loads(row[1])
                        gt['username'] = user_to
                        GroundTruthLogFile.objects.create(username=username, ns_id=mode, insertion_time=row[0],name = topic,
                                                          id_report=report_gt, language=report_gt.language,
                                                          gt_json=gt, gt_type='labels')


                cursor.execute(
                    "SELECT g.username,g.id_report,g.language,g.start,g.stop,g.insertion_time,g.ns_id,g.name,g.label FROM report AS r INNER JOIN annotate AS g ON r.id_report = g.id_report AND r.language = g.language WHERE  g.name = %s AND g.username = %s;",
                    [str(use_case), str(user_from)])
                rows = cursor.fetchall()

                for row in rows:
                    mode = NameSpace.objects.get(ns_id=row[6])
                    username = User.objects.get(username=user_to, ns_id=mode)
                    report = Report.objects.get(id_report=row[1], language=row[2])
                    mention = Mention.objects.get(start=row[3], stop=row[4], id_report=report, language=report.language)
                    topic = UseCase.objects.get(name = row[7])
                    label = AnnotationLabel.objects.get(label = row[8])

                    if overwrite == True and GroundTruthLogFile.objects.filter(username=username,
                                                                               ns_id=mode,
                                                                               id_report=report,name = topic,
                                                                               language=report.language,
                                                                               gt_type='mentions').exists():
                        GroundTruthLogFile.objects.filter(username=username, ns_id=mode, id_report=report,
                                                          language=report.language,name = topic,
                                                          gt_type='mentions').delete()
                        Annotate.objects.filter(username=username, ns_id=mode, id_report=report,name = topic,
                                                 language=report.language).delete()
                for row in rows:
                    mode = NameSpace.objects.get(ns_id=row[6])
                    username = User.objects.get(username=user_to, ns_id=mode)
                    report = Report.objects.get(id_report=row[1], language=row[2])
                    mention = Mention.objects.get(start=row[3], stop=row[4], id_report=report,
                                                  language=report.language)
                    topic = UseCase.objects.get(name=row[7])
                    label = AnnotationLabel.objects.get(label=row[8])
                    if (overwrite == False and not GroundTruthLogFile.objects.filter(username=username,gt_type='mentions', ns_id=mode,name = topic,
                                                                                       id_report=report, language=row[
                            2]).exists()) or overwrite == True or user_from == 'Robot_user':

                        Annotate.objects.create(username=username, name = topic, label = label, seq_number = label.seq_number,ns_id=mode, insertion_time=row[5], start=mention, stop=mention.stop,id_report=report,language=row[2])

                cursor.execute(
                    "SELECT g.insertion_time,g.gt_json,g.id_report,g.language,g.ns_id,g.name FROM report AS r INNER JOIN ground_truth_log_file AS g ON r.id_report = g.id_report AND r.language = g.language WHERE  g.name = %s AND g.username = %s AND gt_type = %s;",
                    [str(use_case), str(user_from), 'mentions'])
                rows_gt_lab = cursor.fetchall()
                for row in rows_gt_lab:
                    mode = NameSpace.objects.get(ns_id=row[4])
                    username = User.objects.get(username=user_to, ns_id=mode)
                    report_gt = Report.objects.get(id_report=row[2],language = row[3])
                    topic = UseCase.objects.get(name = row[5])

                    if (overwrite == False and not GroundTruthLogFile.objects.filter(username=username,name = topic,
                                                                                       gt_type='mentions', ns_id=mode,
                                                                                       id_report=report_gt, language=row[
                            3]).exists()) or overwrite == True or user_from == 'Robot_user':
                        gt = json.loads(row[1])
                        gt['username'] = user_to
                        GroundTruthLogFile.objects.create(username=username, ns_id=mode, insertion_time=row[0],name = topic,
                                                          id_report=report_gt, language=report_gt.language, gt_json=gt,
                                                          gt_type='mentions')


                cursor.execute(
                    "SELECT g.username,g.id_report,g.language,g.concept_url,g.name,g.insertion_time,g.ns_id,g.topic_name FROM report AS r INNER JOIN contains AS g ON r.id_report = g.id_report AND r.language = g.language WHERE  g.topic_name = %s AND g.username = %s;",
                    [str(use_case), str(user_from)])
                rows = cursor.fetchall()

                for row in rows:
                    mode = NameSpace.objects.get(ns_id=row[6])
                    username = User.objects.get(username=user_to, ns_id=mode)
                    report = Report.objects.get(id_report=row[1], language=row[2])
                    concept = Concept.objects.get(concept_url=row[3])
                    sem = SemanticArea.objects.get(name=row[4])
                    topic = UseCase.objects.get(name = row[7])

                    if overwrite == True and GroundTruthLogFile.objects.filter(username=username,
                                                                               ns_id=mode,name = topic,
                                                                               id_report=report,
                                                                               language=report.language,
                                                                               gt_type='concepts').exists():
                        GroundTruthLogFile.objects.filter(username=username, ns_id=mode, id_report=report,
                                                          language=report.language,name = topic,
                                                          gt_type='concepts').delete()
                        Contains.objects.filter(username=username, ns_id=mode, id_report=report,topic_name = topic.name,
                                                 language=report.language).delete()
                for row in rows:
                    mode = NameSpace.objects.get(ns_id=row[6])
                    username = User.objects.get(username=user_to, ns_id=mode)
                    report = Report.objects.get(id_report=row[1], language=row[2])
                    concept = Concept.objects.get(concept_url=row[3])
                    sem = SemanticArea.objects.get(name=row[4])
                    topic = UseCase.objects.get(name=row[7])
                    if (overwrite == False and not GroundTruthLogFile.objects.filter(username=username,gt_type='concepts', ns_id=mode,name = topic,
                                                                                       id_report=report, language=row[
                            2]).exists()) or overwrite == True or user_from == 'Robot_user':

                        Contains.objects.create(username=username, ns_id=mode, insertion_time=row[5], concept_url=concept,topic_name = topic.name,
                                            name=sem,id_report=report,language=row[2])
                cursor.execute(
                    "SELECT g.insertion_time,g.gt_json,g.id_report,g.language,g.ns_id,g.name FROM report AS r INNER JOIN ground_truth_log_file AS g ON r.id_report = g.id_report AND r.language = g.language WHERE  g.name = %s AND g.username = %s AND gt_type = %s;",
                    [str(use_case), str(user_from), 'concepts'])
                rows_gt_lab = cursor.fetchall()
                for row in rows_gt_lab:
                    mode = NameSpace.objects.get(ns_id=row[4])
                    username = User.objects.get(username=user_to, ns_id=mode)
                    report = Report.objects.get(id_report=row[2],language = row[3])
                    topic = UseCase.objects.get(name = row[5])

                    if (overwrite == False and not GroundTruthLogFile.objects.filter(username=username,name = topic,
                                                                                       gt_type='concepts', ns_id=mode,
                                                                                       id_report=report, language=row[
                            3]).exists()) or overwrite == True or user_from == 'Robot_user':
                        gt = json.loads(row[1])
                        gt['username'] = user_to

                        GroundTruthLogFile.objects.create(username=username, ns_id=mode, insertion_time=row[0],name = topic,
                                                          id_report=report, language=report.language,
                                                          gt_json=gt,
                                                          gt_type='concepts')
                cursor.execute(
                    "SELECT g.username,g.id_report,g.language,g.concept_url,g.name,g.start,g.stop,g.insertion_time,g.ns_id,g.topic_name FROM report AS r INNER JOIN linked AS g ON r.id_report = g.id_report AND r.language = g.language WHERE  g.topic_name = %s AND username = %s;",
                    [str(use_case), str(user_from)])
                rows = cursor.fetchall()

                for row in rows:
                    mode = NameSpace.objects.get(ns_id=row[8])
                    username = User.objects.get(username=user_to, ns_id=mode)
                    username_from = User.objects.get(username=user_from, ns_id=mode)
                    report = Report.objects.get(id_report=row[1], language=row[2])
                    concept = Concept.objects.get(concept_url=row[3])
                    sem = SemanticArea.objects.get(name=row[4])
                    topic = UseCase.objects.get(name = row[9])

                    from_arr = []
                    to_arr = []
                    for el in Annotate.objects.filter(name = topic,id_report = report,language = report.language, username = username,ns_id = mode).values('start','stop'):
                        from_arr.append(el['start'])
                    for el in Annotate.objects.filter(id_report=report, language=report.language,name = topic,
                                                          username=username, ns_id=mode).values('start', 'stop'):
                        to_arr.append(el['start'])
                    mention = Mention.objects.get(start=row[5], stop=row[6], id_report=report, language=report.language)
                    if overwrite == True and GroundTruthLogFile.objects.filter(username=username,
                                                                               ns_id=mode,name = topic,
                                                                               id_report=report,
                                                                               language=report.language,
                                                                               gt_type='concept-mention').exists():
                        GroundTruthLogFile.objects.filter(username=username, ns_id=mode, id_report=report,name = topic,
                                                          language=report.language,
                                                          gt_type='concept-mention').delete()
                        Linked.objects.filter(username=username, ns_id=mode, id_report=report,topic_name = topic.name,
                                                 language=report.language).delete()
                for row in rows:
                    mode = NameSpace.objects.get(ns_id=row[8])
                    username = User.objects.get(username=user_to, ns_id=mode)
                    username_from = User.objects.get(username=user_from, ns_id=mode)
                    report = Report.objects.get(id_report=row[1], language=row[2])
                    concept = Concept.objects.get(concept_url=row[3])
                    sem = SemanticArea.objects.get(name=row[4])
                    topic = UseCase.objects.get(name=row[9])
                    if (overwrite == False and set(to_arr) == set(from_arr) and not GroundTruthLogFile.objects.filter(username=username,
                                                                                       gt_type='concept-mention', ns_id=mode,name = topic,
                                                                                       id_report=report, language=row[
                            2]).exists()) or overwrite == True or user_from == 'Robot_user':

                        Linked.objects.create(username=username, ns_id=mode, insertion_time=row[7], name=sem,topic_name = topic.name,
                                          start=mention, stop=mention.stop, concept_url=concept, id_report=report,
                                          language=row[2])


                cursor.execute(
                    "SELECT g.insertion_time,g.gt_json,g.id_report,g.language,g.ns_id,g.name FROM report AS r INNER JOIN ground_truth_log_file AS g ON r.id_report = g.id_report AND r.language = g.language WHERE  g.name = %s AND g.username = %s AND gt_type = %s;",
                    [str(use_case), str(user_from), 'concept-mention'])
                rows_gt_lab = cursor.fetchall()
                for row in rows_gt_lab:
                    mode = NameSpace.objects.get(ns_id=row[4])
                    username = User.objects.get(username=user_to, ns_id=mode)
                    report = Report.objects.get(id_report=row[2],language = row[3])
                    topic = UseCase.objects.get(name = row[5])

                    from_arr = []
                    to_arr = []
                    for el in Annotate.objects.filter(id_report=report, language=report.language,name = topic,
                                                      username=username_from, ns_id=mode).values('start', 'stop'):
                        from_arr.append(el['start'])
                    for el in Annotate.objects.filter(id_report=report, language=report.language,name = topic,
                                                      username=username, ns_id=mode).values('start', 'stop'):
                        to_arr.append(el['start'])
                    if (overwrite == False and set(to_arr) == set(from_arr) and not GroundTruthLogFile.objects.filter(username=username,name = topic,
                                                                                     gt_type='concept-mention', ns_id=mode,
                                                                                     id_report=report, language=row[
                                3]).exists()) or overwrite == True or user_from == 'Robot_user':
                        gt = json.loads(row[1])
                        gt['username'] = user_to
                        GroundTruthLogFile.objects.create(username=username, ns_id=mode, insertion_time=row[0],name = topic,
                                                      id_report=report, language=report.language, gt_json=gt,
                                                      gt_type='concept-mention')
            return True
    except Exception as e:
        print(e)
        return False


def get_annotations_count(id_report,language,topic):

    """Given a report and its language and an annotation mode, this method returns:
    - the number of annotations for each task
    - the number of annotations for each label/mention/association/concept
    - whether the robot annotated that label/mention/association/concept"""

    report = Report.objects.get(id_report=id_report, language=language)
    json_dict = {}
    mode_human = NameSpace.objects.get(ns_id='Human')
    mode_robot = NameSpace.objects.get(ns_id='Robot')
    user_robot = User.objects.get(username = 'Robot_user', ns_id=mode_robot)
    topic = UseCase.objects.get(name = topic)
    # HUMAN
    json_dict['Human'] = {}
    json_dict['Human']['labels'] = {}
    json_dict['Human']['mentions'] = {}
    json_dict['Human']['concepts'] = {}
    json_dict['Human']['linking'] = {}

    json_dict['Human']['labels']['users_list'] = []
    labels_human_users = GroundTruthLogFile.objects.filter(name = topic,id_report = report,language = language,ns_id = mode_human,gt_type='labels').values('username')
    for user in labels_human_users:
        if user['username'] not in ['Robot_user']:
            json_dict['Human']['labels']['users_list'].append(user['username'])

    json_dict['Human']['mentions']['users_list'] = []
    mentions_human_users = GroundTruthLogFile.objects.filter(name = topic,id_report = report,language = language,ns_id = mode_human,gt_type='mentions').values('username')
    for user in mentions_human_users:
        if user['username'] not in ['Robot_user']:
            json_dict['Human']['mentions']['users_list'].append(user['username'])

    json_dict['Human']['concepts']['users_list'] = []
    concepts_human_users = GroundTruthLogFile.objects.filter(name = topic,id_report = report,language = language,ns_id = mode_human,gt_type='concepts').values('username')
    for user in concepts_human_users:
        if user['username'] not in ['Robot_user']:
            json_dict['Human']['concepts']['users_list'].append(user['username'])

    json_dict['Human']['linking']['users_list'] = []
    linking_human_users = GroundTruthLogFile.objects.filter(name = topic,id_report = report,language = language,ns_id = mode_human,gt_type='concept-mention').values('username')
    for user in linking_human_users:
        if user['username'] not in ['Robot_user']:
            json_dict['Human']['linking']['users_list'].append(user['username'])

    json_dict['Human']['labels']['labels_list'] = []
    json_dict['Human']['mentions']['mentions_list'] = []
    json_dict['Human']['concepts']['concepts_list'] = []
    json_dict['Human']['linking']['linking_list'] = []

    gt_labels = GroundTruthLogFile.objects.filter(name = topic,ns_id=mode_human,id_report=report,language = language,gt_type='labels').count()
    gt_mentions = GroundTruthLogFile.objects.filter(name = topic,ns_id=mode_human,id_report=report,language = language,gt_type='mentions').count()
    gt_concepts = GroundTruthLogFile.objects.filter(name = topic,ns_id=mode_human,id_report=report,language = language,gt_type='concepts').count()
    gt_linking = GroundTruthLogFile.objects.filter(name = topic,ns_id=mode_human,id_report=report,language = language,gt_type='concept-mention').count()

    json_dict['Human']['mentions']['count'] = gt_mentions
    json_dict['Human']['concepts']['count'] = gt_concepts
    json_dict['Human']['linking']['count'] = gt_linking
    json_dict['Human']['labels']['count'] = gt_labels

    users_black_list = ['Robot_users']
    # LABELS HUMAN
    labels_list = AnnotationLabel.objects.all()
    for label in labels_list:
        json_val = {}
        annotations = Associate.objects.filter(name = topic,label=label,seq_number=label.seq_number,id_report = report,language=language,ns_id=mode_human)
        if annotations.exists() and annotations.count() > 0:
            json_val['label'] = label.label
            json_val['count'] = annotations.count()
            json_val['users_list'] = []
            users = annotations.values('username')
            for us in users:
                if us['username'] not in users_black_list and us['username'] not in json_val['users_list']:
                    json_val['users_list'].append(us['username'])
            json_dict['Human']['labels']['labels_list'].append(json_val)

    # MENTIONS HUMAN
    rep_mentions = Mention.objects.filter(id_report = report,language = language)
    for mention in rep_mentions:
        json_val = {}
        json_val['start'] = mention.start
        json_val['stop'] = mention.stop
        json_val['mention'] = mention.mention_text
        json_val['labels'] = []
        json_val['count'] = 0
        labels = AnnotationLabel.objects.all()
        for l in labels:
            json_lab = {}
            json_lab['label'] = l.label
            annotations = Annotate.objects.filter(name = topic, id_report=report, label = l,language=language, ns_id=mode_human, start=mention,stop=mention.stop)
            if annotations.exists() and annotations.count() > 0:
                json_val['count'] += annotations.count()
                json_lab['count'] = annotations.count()
                json_lab['users_list'] = []
                users = annotations.values('username')
                for us in users:
                    if us['username'] not in users_black_list and us['username'] not in json_lab['users_list']:
                        json_lab['users_list'].append(us['username'])
                json_val['labels'].append(json_lab)
        json_dict['Human']['mentions']['mentions_list'].append(json_val)

    # CONCEPTS HUMAN
    rep_concepts = Contains.objects.filter(id_report = report, topic_name = topic.name,language = language,ns_id=mode_human).distinct('concept_url')
    for c in rep_concepts:
        json_val = {}
        concept = Concept.objects.get(concept_url=c.concept_url_id)
        area = SemanticArea.objects.get(name=c.name_id)
        annotations = Contains.objects.filter(id_report=report, language=language,topic_name = topic.name, ns_id=mode_human, concept_url = concept,name=area)
        if annotations.exists() and annotations.count() > 0:
            json_val['concept_url'] = concept.concept_url
            json_val['concept_name'] = concept.name
            json_val['area'] = area.name
            json_val['count'] = annotations.count()
            json_val['users_list'] = []
            users = annotations.values('username')
            for us in users:
                if us['username'] not in users_black_list and us['username'] not in json_val['users_list']:
                    json_val['users_list'].append(us['username'])
            json_dict['Human']['concepts']['concepts_list'].append(json_val)

    # LINKS HUMAN
    rep_links = Linked.objects.filter(id_report=report,topic_name = topic.name, language=language, ns_id=mode_human).distinct('start','concept_url','name')
    for c in rep_links:
        json_val = {}
        mention = Mention.objects.get(start = c.start_id,stop = c.stop,id_report = report,language = language)
        concept = Concept.objects.get(concept_url=c.concept_url_id)
        area = SemanticArea.objects.get(name=c.name_id)
        annotations = Linked.objects.filter(topic_name = topic.name,id_report=report, language=language, ns_id=mode_human,
                                              concept_url=concept, name=area,start = mention,stop = mention.stop)
        if annotations.exists() and annotations.count() > 0:
            json_val['mention'] = mention.mention_text
            json_val['start'] = mention.start
            json_val['stop'] = mention.stop
            json_val['concept_url'] = concept.concept_url
            json_val['concept_name'] = concept.name
            json_val['area'] = area.name
            json_val['count'] = annotations.count()
            json_val['users_list'] = []
            users = annotations.values('username')
            for us in users:
                if us['username'] not in users_black_list and us['username'] not in json_val['users_list']:
                    json_val['users_list'].append(us['username'])
            json_dict['Human']['linking']['linking_list'].append(json_val)

    print(json_dict)
    return json_dict


import shutil
def decompress_files(reports):

    """this method decompress zip files"""

    reps_to_ret = []
    workpath = os.path.dirname(os.path.abspath(__file__))  # Returns the Path your .py file is in
    dir_path = os.path.join(workpath, './static/tmp')
    if os.path.exists(dir_path):
        shutil.rmtree(dir_path)
    for report in reports:
        if isinstance(report,str):
            rep_name = report
        else:
            rep_name = report.name
        if rep_name.endswith('zip'):
            if not os.path.exists(dir_path):
                os.makedirs(dir_path)
            with zipfile.ZipFile(report, 'r') as zip_ref:
                zip_ref.extractall(dir_path)
        if os.path.exists(dir_path):
            files = os.listdir(dir_path)
            reps_to_ret.extend(files)
        else:
            reps_to_ret.append(report)




    return reps_to_ret




# def check_exa_lab_conc_only(usecase):
#
#     """This method returns whether the concepts and the labels for a use case are only those of examode"""
#
#     cursor = connection.cursor()
#     bool = [True,True]
#     # cursor.execute("SELECT annotation_mode FROM concept AS c INNER JOIN concept_has_uc AS ch ON c.concept_url = ch.concept_url WHERE ch.name=%s",[str(usecase)])
#     cursor.execute("SELECT * FROM concept AS c INNER JOIN concept_has_uc AS ch ON c.concept_url = ch.concept_url WHERE ch.name=%s and annotation_mode in %s",[str(usecase),('Manual','Automatic')])
#     ans = cursor.fetchall()
#     if len(ans) > 0:
#         bool[1] = False
#     # cursor.execute("SELECT label FROM annotation_label WHERE annotation_mode !=  %s and name=%s",['Automatic',str(usecase)])
#     cursor.execute("SELECT label FROM annotation_label WHERE annotation_mode in  %s and name=%s",[('Manual','Automatic'),str(usecase)])
#     ans = cursor.fetchall()
#     if len(ans) > 0:
#         bool[0] = False
#     return bool



# def restore_robot_annotation(report,action,user):
#
#     """This method restores the robot annotation of a report for a specific action. This action is needed when the usert
#     wants to delete an automatic ground truth. In this case the robot's annotation is restored."""
#
#     try:
#         with transaction.atomic():
#             mode = NameSpace.objects.get(ns_id = 'Robot')
#             robot = User.objects.get(ns_id=mode, username='Robot_user')
#             gt_to_del = GroundTruthLogFile.objects.filter(gt_type = action,username=user,ns_id=mode,id_report = report,language = report.language)
#             gt_robot = GroundTruthLogFile.objects.get(gt_type = action,ns_id=mode,username=robot,id_report = report,language = report.language)
#
#             gt_to_del.delete()
#             GroundTruthLogFile.objects.create(ns_id=mode,username=user,gt_type = action,gt_json = gt_robot.gt_json,insertion_time = gt_robot.insertion_time,id_report = report,language = report.language)
#
#             if action == 'labels':
#                 to_del_user = Associate.objects.filter(username=user,ns_id = mode,id_report = report,language = report.language)
#                 robot_annos = Associate.objects.filter(username=robot,ns_id = mode,id_report = report,language = report.language)
#                 to_del_user.delete()
#                 for el in robot_annos:
#                     label = AnnotationLabel.objects.get(label = el.label_id,seq_number = el.seq_number)
#                     Associate.objects.create(label = label,seq_number = el.seq_number,insertion_time = el.insertion_time,username=user,ns_id = mode,id_report = report,language = report.language)
#
#             if action == 'mentions':
#                 to_del_user = Annotate.objects.filter(username=user, ns_id=mode, id_report=report,
#                                                        language=report.language)
#                 robot_annos = Annotate.objects.filter(username=robot, ns_id=mode, id_report=report,
#                                                        language=report.language)
#                 to_del_user.delete()
#                 for el in robot_annos:
#                     mention = Mention.objects.get(id_report = report,language = report.language, start = el.start_id, stop = el.stop)
#                     Annotate.objects.create(
#                                              insertion_time=el.insertion_time, username=user, ns_id=mode,
#                                              id_report=report,start = mention, stop = mention.stop, language=report.language)
#
#                     robot_links = Linked.objects.filter(username=robot, ns_id=mode,
#                                              id_report=report,start = mention, stop = mention.stop, language=report.language)
#                     for link in robot_links:
#                         if not Linked.objects.filter(id_report = report,language = report.language,username=user,ns_id=mode,start=mention,stop = mention.stop,name = link.name,concept_url =link.concept_url).exists():
#                             Linked.objects.create(id_report = report,language = report.language,username=user,ns_id=mode,insertion_time=link.insertion_time,start=mention,stop = mention.stop,name = link.name,concept_url =link.concept_url)
#                         if not Contains.objects.filter(id_report = report,language = report.language,username=user,ns_id=mode,name=link.name,concept_url = link.concept_url).exists():
#                             Contains.objects.create(id_report = report,language = report.language,username=user,ns_id=mode,insertion_time=link.insertion_time,name=link.name,concept_url = link.concept_url)
#
#                 gt_link_robot = GroundTruthLogFile.objects.get(gt_type='concept-mention',id_report = report,language = report.language,username=robot,ns_id=mode)
#                 gt_conc_robot = GroundTruthLogFile.objects.get(gt_type='concepts',id_report = report,language = report.language,username=robot,ns_id=mode)
#                 GroundTruthLogFile.objects.filter(gt_type='concept-mention', id_report=report, language=report.language,
#                                                username=user, ns_id=mode).delete()
#                 gt_prv = GroundTruthLogFile.objects.filter(gt_type='concepts', id_report=report,
#                                                            language=report.language,
#                                                            username=user, ns_id=mode)
#                 GroundTruthLogFile.objects.filter(gt_type='concepts', id_report=report, language=report.language,
#                                                username=user, ns_id=mode).delete()
#                 json_serial1 = serialize_gt('concepts',report.name_id,user.username,report.id_report,report.language,mode)
#                 json_serial2 = serialize_gt('concept-mention',report.name_id,user.username,report.id_report,report.language,mode)
#                 GroundTruthLogFile.objects.create(gt_type='concept-mention', id_report=report, language=report.language,
#                                                username=user, ns_id=mode,insertion_time = gt_link_robot.insertion_time,gt_json=json_serial2)
#                 c_robot = Contains.objects.filter(id_report=report, username=robot, language=report.language).values(
#                     'concept_url', 'name')
#                 cr = []
#                 for el in c_robot:
#                     cr.append((el['concept_url'], el['name']))
#
#                 c_1 = Contains.objects.filter(id_report=report, username=user, language=report.language).values(
#                     'concept_url', 'name')
#                 c1 = []
#                 for el in c_1:
#                     c1.append((el['concept_url'], el['name']))
#                 if set(cr) == set(c1):
#                     GroundTruthLogFile.objects.create(gt_type='concepts', id_report=report, language=report.language,
#                                                       username=user, ns_id=mode,
#                                                       insertion_time=gt_conc_robot.insertion_time,
#                                                       gt_json=json_serial1)
#                 else:
#                     GroundTruthLogFile.objects.create(gt_type='concepts', id_report=report, language=report.language,
#                                                       username=user, ns_id=mode,
#                                                       insertion_time=gt_prv.insertion_time,
#                                                       gt_json=json_serial1)
#
#
#             if action == 'concepts':
#                     to_del_user = Contains.objects.filter(username=user, ns_id=mode, id_report=report,language=report.language)
#                     robot_annos = Contains.objects.filter(username=robot, ns_id=mode, id_report=report,language=report.language)
#                     to_del_user.delete()
#                     for el in robot_annos:
#                         concept = Concept.objects.get(concept_url = el.concept_url_id)
#                         area = SemanticArea.objects.get(name = el.name_id)
#                         Contains.objects.create(
#                                                  insertion_time=el.insertion_time, username=user, ns_id=mode,
#                                                  id_report=report,concept_url = concept, name = area, language=report.language)
#             if action == 'concept-mention':
#                     to_del_user = Linked.objects.filter(username=user, ns_id=mode, id_report=report,
#                                                            language=report.language)
#                     robot_annos = Linked.objects.filter(username=robot, ns_id=mode, id_report=report,
#                                                            language=report.language)
#                     to_del_user.delete()
#                     for el in robot_annos:
#                         mention = Mention.objects.get(id_report=report, language=report.language, start=el.start_id,
#                                                       stop=el.stop)
#                         concept = Concept.objects.get(concept_url = el.concept_url_id)
#                         area = SemanticArea.objects.get(name = el.name_id)
#                         Linked.objects.create(start = mention, stop = mention.stop,
#                                                  insertion_time=el.insertion_time, username=user, ns_id=mode,
#                                                  id_report=report,concept_url = concept, name = area, language=report.language)
#
#                         robot_concept_anno = Contains.objects.get(id_report = report,language=report.language, name=area,concept_url = concept,username=robot,ns_id=mode)
#                         if not Contains.objects.filter(username=user, ns_id=mode,concept_url = concept,name=area,
#                                                             id_report=report,
#                                                             language=report.language).exists():
#                             Contains.objects.create(username=user, ns_id=mode, concept_url=concept, name=area,
#                                                     id_report=report, insertion_time=robot_concept_anno.insertion_time,
#                                                     language=report.language)
#
#                     gt_conc_robot = GroundTruthLogFile.objects.get(gt_type='concepts', id_report=report,
#                                                                    language=report.language, username=robot, ns_id=mode)
#
#                     gt_prv = GroundTruthLogFile.objects.filter(gt_type='concepts', id_report=report, language=report.language,
#                                                       username=user, ns_id=mode)
#                     GroundTruthLogFile.objects.filter(gt_type='concepts', id_report=report, language=report.language,
#                                                       username=user, ns_id=mode).delete()
#
#                     json_serial1 = serialize_gt('concepts', report.name_id, user.username, report.id_report,
#                                                 report.language, mode)
#                     c_robot = Contains.objects.filter(id_report=report,username = robot,language=report.language).values('concept_url','name')
#                     cr = []
#                     for el in c_robot:
#                         cr.append((el['concept_url'],el['name']))
#
#                     c_1 = Contains.objects.filter(id_report=report,username = user,language=report.language).values('concept_url','name')
#                     c1 = []
#                     for el in c_1:
#                         c1.append((el['concept_url'],el['name']))
#                     if set(cr) == set(c1):
#
#                         GroundTruthLogFile.objects.create(gt_type='concepts', id_report=report, language=report.language,
#                                                       username=user, ns_id=mode,
#                                                       insertion_time=gt_conc_robot.insertion_time,
#                                                       gt_json=json_serial1)
#                     else:
#                         GroundTruthLogFile.objects.create(gt_type='concepts', id_report=report, language=report.language,
#                                                       username=user, ns_id=mode,
#                                                       insertion_time=gt_prv.insertion_time,
#                                                       gt_json=json_serial1)
#     except Exception as e:
#         print(e)
#         json_response = {'error': 'an error occurred'}
#         return (json_response)
#     else:
#         json_response = {'message': 'Robot mode, Robot GT restored.'}
#         return (json_response)

