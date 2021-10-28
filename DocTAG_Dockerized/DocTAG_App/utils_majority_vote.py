from DocTAG_App.models import *
import numpy
from django.db import connection
from psycopg2.extensions import register_adapter, AsIs


def addapt_numpy_float64(numpy_float64):
    return AsIs(numpy_float64)


def addapt_numpy_int64(numpy_int64):
    return AsIs(numpy_int64)


register_adapter(numpy.float64, addapt_numpy_float64)
register_adapter(numpy.int64, addapt_numpy_int64)


def create_majority_vote_gt(action,users,mode,report,topic):

    """This method creates the majority vote ground truth."""

    ns_human = NameSpace.objects.get(ns_id='Human')
    ns_robot = NameSpace.objects.get(ns_id='Robot')
    agent = User.objects.get(username='Robot_user',ns_id=ns_robot)
    topic_obj = topic
    if isinstance(topic,str):
        topic_obj = UseCase.objects.get(name=topic)
    majority_gt = {}
    majority_gt['Human'] = []
    # majority_gt['Robot'] = []
    # majority_gt['both'] = []
    cursor = connection.cursor()
    try:
        if action == 'labels':
            # man_modes = ['Manual','Manual and Automatic']
            # auto_modes = ['Automatic','Manual and Automatic']
            users1 = User.objects.filter(username__in=users, ns_id=ns_human)
            labels = AnnotationLabel.objects.all()
            total_gt = GroundTruthLogFile.objects.filter(name = topic_obj,gt_type='labels', ns_id=ns_human,username__in=users1, id_report=report,language=report.language).count()
            for lab in labels:
                print(str(topic_obj.name))
                print(lab.label)
                cursor.execute("SELECT username,label,seq_number FROM associate AS a INNER JOIN topic_has_document AS t ON t.id_report = a.id_report AND  t.name = a.name and t.language = a.language WHERE label = %s AND seq_number = %s AND ns_id = %s AND t.id_report = %s AND t.language = %s AND username IN %s AND t.name = %s",
                               [lab.label,int(lab.seq_number),'Human',str(report.id_report),str(report.language),tuple(users),str(topic_obj.name)])
                json_val = {}
                assos_human = cursor.fetchall()
                json_val['users_list'] = []
                for ass in assos_human:
                    if ass[0] not in json_val['users_list']:
                        json_val['users_list'].append(ass[0])
                json_val['count'] = len(assos_human)
                json_val['label'] = lab.label
                json_val['total_gt'] = total_gt
                if json_val['count'] > (json_val['total_gt'] / 2):
                    majority_gt['Human'].append(json_val)



        elif action == 'mentions':
            users1 = User.objects.filter(username__in=users,ns_id=ns_human)
            mentions = Annotate.objects.filter(name = topic_obj,username__in=users1,ns_id=ns_human,id_report = report, language = report.language).distinct('start','stop','label')
            total_gt = GroundTruthLogFile.objects.filter(name = topic_obj,username__in=users1,gt_type='mentions',ns_id=ns_human,id_report = report,language = report.language)

            for el in mentions:
                json_val = {}
                lab = AnnotationLabel.objects.get(label = el.label_id)
                mention = Mention.objects.get(start=el.start_id,stop=el.stop,id_report = report, language = report.language)
                anno = Annotate.objects.filter(label = lab,name =topic_obj,username__in = users1,id_report = report,language = report.language,start = mention,stop=mention.stop,ns_id=ns_human)
                json_val['count'] = anno.count()
                json_val['total_gt'] = total_gt.count()
                json_val['mention'] = mention.mention_text
                json_val['start'] = mention.start
                json_val['stop'] = mention.stop
                json_val['label'] = lab.label
                json_val['users_list'] = []
                for ass in anno:
                    if ass.username_id not in json_val['users_list']:
                        json_val['users_list'].append(ass.username_id)
                if json_val['count'] > (json_val['total_gt'] / 2):
                    majority_gt['Human'].append(json_val)


        elif action == 'concepts':
            # if mode == 'Human':
            users1 = User.objects.filter(username__in=users,ns_id=ns_human)
            concepts = Contains.objects.filter(username__in=users1,topic_name=topic_obj.name, ns_id=ns_human, id_report=report,
                                              language=report.language).distinct('concept_url', 'name')
            total_gt = GroundTruthLogFile.objects.filter(name = topic_obj,gt_type='concepts', ns_id=ns_human, id_report=report,
                                                         language=report.language,username__in=users1)

            for el in concepts:
                json_val = {}
                concept = Concept.objects.get(concept_url=el.concept_url_id)
                area = SemanticArea.objects.get(name=el.name_id)
                anno = Contains.objects.filter(topic_name = topic_obj.name,username__in=users1, id_report=report,
                                               language=report.language, concept_url=concept, name=area,ns_id=ns_human)
                json_val['count'] = anno.count()
                json_val['total_gt'] = total_gt.count()
                json_val['concept_url'] = concept.concept_url
                json_val['concept_name'] = concept.name
                json_val['area'] = area.name
                json_val['users_list'] = []

                for ass in anno:
                    if ass.username_id not in json_val['users_list']:
                        json_val['users_list'].append(ass.username_id)
                if json_val['count'] > (json_val['total_gt'] / 2):
                    majority_gt['Human'].append(json_val)



        elif action == 'concept-mention':
            # if mode == 'Human':
            users1 = User.objects.filter(username__in=users, ns_id=ns_human)
            concepts = Linked.objects.filter(username__in=users, ns_id=ns_human, id_report=report,topic_name = topic_obj.name,
                                               language=report.language).distinct('concept_url', 'name','start')
            total_gt = GroundTruthLogFile.objects.filter(name = topic_obj,gt_type='concept-mention', ns_id=ns_human, id_report=report,
                                                         language=report.language, username__in=users1)
            for el in concepts:
                json_val = {}
                mention = Mention.objects.get(id_report = report, language = report.language, start=el.start_id, stop = el.stop)
                concept = Concept.objects.get(concept_url=el.concept_url_id)
                area = SemanticArea.objects.get(name=el.name_id)
                anno = Linked.objects.filter(topic_name = topic_obj.name,username__in=users1, id_report=report,start = mention,stop = mention.stop,
                                               language=report.language, concept_url=concept, name=area,
                                               ns_id=ns_human)
                json_val['count'] = anno.count()
                json_val['total_gt'] = total_gt.count()
                json_val['concept_url'] = concept.concept_url
                json_val['concept_name'] = concept.name
                json_val['area'] = area.name
                json_val['start'] = mention.start
                json_val['stop'] = mention.stop
                json_val['mention'] = mention.mention_text
                json_val['users_list'] = []

                for ass in anno:
                    if ass.username_id not in json_val['users_list']:
                        json_val['users_list'].append(ass.username_id)
                if json_val['count'] > (json_val['total_gt'] / 2):
                    majority_gt['Human'].append(json_val)


        return majority_gt
    except Exception as e:
        print(e)
        json_resp = {'error':e}
        return json_resp


def create_majority_json(users,reports,action,mode):

    """This method converts the object returned by create_majority_vote_gt into json"""

    final_json = {}
    norm = ''
    if action == 'concept-mention':
        final_json['action'] = 'linking'
    else:
        final_json['action'] = action
    if mode == 'both':
        norm = 'manual_and_auto'
    else:
        norm = mode
    # elif mode == 'Human':
    #     norm = 'Manual'
    # elif mode == 'Robot':
    #     norm = 'Automatic'
    final_json['annotation_mode'] = norm
    final_json['chosen_annotators'] = users
    final_json['reports'] = []
    for report in reports:
        # print(report)
        rep = Report.objects.get(id_report = report['id_report'],language = report['language'])
        json_to_ret = {}
        gt_dict = create_majority_vote_gt(action,users,mode,rep,report['topic'])
        data = gt_dict[mode]
        json_to_ret['id_report'] = report['id_report']
        json_to_ret['topic'] = report['topic']
        json_to_ret['language'] = report['language']

        if action == 'labels':
            json_to_ret['labels_list'] = []
            for val in data:
                if int(val['count']) > int(val['total_gt'] / 2):
                    json_val = {}
                    json_to_ret['total_annotators'] = val['total_gt']
                    json_val['label'] = val['label']
                    if mode == 'Human':
                        json_val['manual_annotators'] = (', '.join(val['users_list']))
                        json_val['robot_annotators'] = 0
                    if mode == 'Robot':
                        json_val['manual_annotators'] = 0
                        if 'Robot_user' in val['users_list']:
                            val['users_list'].remove('Robot_user')
                        json_val['robot_annotators'] = (', '.join(val['users_list']))

                    if mode == 'both':
                        json_val['manual_annotators'] = (', '.join(val['manual_annotators']))
                        if 'Robot_user' in val['robot_annotators']:
                            json_val['robot_annotators'].remove('Robot_user')
                        json_val['robot_annotators'] = (', '.join(val['robot_annotators']))

                    json_to_ret['labels_list'].append(json_val)

        elif action == 'mentions':
            json_to_ret['mentions_list'] = []
            for val in data:
                # print(val)
                json_to_ret['total_annotators'] = val['total_gt']
                if int(val['count']) > int(val['total_gt'] / 2):
                    json_val = {}

                    json_val['start'] = val['start']
                    json_val['stop'] = val['stop']
                    json_val['mention'] = val['mention']
                    if mode == 'Human':
                        json_val['manual_annotators'] = (', '.join(val['users_list']))
                        json_val['robot_annotators'] = 0
                    if mode == 'Robot':
                        json_val['manual_annotators'] = 0
                        if 'Robot_user' in val['users_list']:
                            val['users_list'].remove('Robot_user')
                        json_val['robot_annotators'] = (', '.join(val['users_list']))

                    if mode == 'both':
                        json_val['manual_annotators'] = (', '.join(val['manual_annotators']))
                        if 'Robot_user' in val['robot_annotators']:
                            json_val['robot_annotators'].remove('Robot_user')
                        json_val['robot_annotators'] = (', '.join(val['robot_annotators']))

                    json_to_ret['mentions_list'].append(json_val)
        elif action == 'concepts':
            json_to_ret['concepts_list'] = []

            for val in data:
                json_to_ret['total_annotators'] = val['total_gt']
                if int(val['count']) > int(val['total_gt'] / 2):
                    json_val = {}

                    json_val['concept_url'] = val['concept_url']
                    json_val['concept_name'] = val['concept_name']
                    json_val['area'] = val['area']
                    if mode == 'Human':
                        json_val['manual_annotators'] = (', '.join(val['users_list']))
                        json_val['robot_annotators'] = 0
                    if mode == 'Robot':
                        json_val['manual_annotators'] = 0
                        if 'Robot_user' in val['users_list']:
                            val['users_list'].remove('Robot_user')
                        json_val['robot_annotators'] = (', '.join(val['users_list']))

                    if mode == 'both':
                        json_val['manual_annotators'] = (', '.join(val['manual_annotators']))
                        if 'Robot_user' in val['robot_annotators']:
                            json_val['robot_annotators'].remove('Robot_user')
                        json_val['robot_annotators'] = (', '.join(val['robot_annotators']))

                    json_to_ret['concepts_list'].append(json_val)

        elif action == 'concept-mention':
            json_to_ret['linking_list'] = []
            for val in data:

                json_to_ret['total_annotators'] = val['total_gt']
                if int(val['count']) > int(val['total_gt'] / 2):
                    json_val = {}
                    json_val['concept_url'] = val['concept_url']
                    json_val['concept_name'] = val['concept_name']
                    json_val['area'] = val['area']
                    json_val['start'] = val['start']
                    json_val['stop'] = val['stop']
                    json_val['mention'] = val['mention']
                    # json_val['annotators'] = val['users_list']
                    if mode == 'Human':
                        json_val['manual_annotators'] = (', '.join(val['users_list']))
                        json_val['robot_annotators'] = 0
                    if mode == 'Robot':
                        json_val['manual_annotators'] = 0
                        if 'Robot_user' in val['users_list']:
                            val['users_list'].remove('Robot_user')
                        json_val['robot_annotators'] = (', '.join(val['users_list']))

                    if mode == 'both':
                        json_val['manual_annotators'] = (', '.join(val['manual_annotators']))
                        if 'Robot_user' in val['robot_annotators']:
                            json_val['robot_annotators'].remove('Robot_user')
                        json_val['robot_annotators'] = (', '.join(val['robot_annotators']))

                    json_to_ret['linking_list'].append(json_val)

        final_json['reports'].append(json_to_ret)

    print(final_json)
    return final_json


def create_majority_csv(users,reports,action,mode):

    """This method creates the majority vote ground truth in csv format"""

    row_list = []
    for report in reports:
        rep = Report.objects.get(id_report = report['id_report'],language = report['language'])
        topic = UseCase.objects.get(name = report['topic'])
        gt_dict = create_majority_vote_gt(action, users, mode, rep,topic)
        data = gt_dict[mode]
        for val in data:

            norm = ''
            row = []
            if mode == 'both':
                norm = 'manual_and_auto'
                if 'Robot_user' in val['robot_annotators']:
                    val['robot_annotators'].remove('Robot_user')
            elif mode == 'Human':
                norm = 'Manual'
            elif mode == 'Robot':
                norm = 'Automatic'
                if 'Robot_user' in val['users_list']:
                    val['users_list'].remove('Robot_user')
            row.append(norm)
            if action == 'concept-mention':
                row.append('linking')
            else:
                row.append(action)

            # if 'Robot_user' in val['users_list']:
            #     val['users_list'].remove('Robot_user')
                # val['total_gt'] = val['total_gt'] - 1
            row.append(rep.id_report)
            row.append(rep.language)
            row.append(rep.institute)
            row.append(report['topic'])
            if action == 'labels':
                row.append(val['label'])
                if mode == 'Human':
                    row.append(', '.join(val['users_list']))
                    row.append(0)
                if mode == 'Robot':
                    row.append(0)
                    row.append(', '.join(val['users_list']))
                if mode == 'both':
                    row.append(', '.join(val['manual_annotators']))
                    row.append(', '.join(val['robot_annotators']))
                # row.append(val['total_gt'])
            elif action == 'mentions':
                row.append(val['start'])
                row.append(val['stop'])
                row.append(val['mention'])

                if mode == 'Human':
                    row.append(', '.join(val['users_list']))
                    row.append(0)
                if mode == 'Robot':
                    row.append(0)
                    row.append(', '.join(val['users_list']))
                if mode == 'both':
                    row.append(', '.join(val['manual_annotators']))
                    row.append(', '.join(val['robot_annotators']))
                # row.append(val['total_gt'])
            elif action == 'concepts':
                row.append(val['concept_url'])
                row.append(val['concept_name'])
                row.append(val['area'])
                if mode == 'Human':
                    row.append(', '.join(val['users_list']))
                    row.append(0)
                if mode == 'Robot':
                    row.append(0)
                    row.append(', '.join(val['users_list']))
                if mode == 'both':
                    row.append(', '.join(val['manual_annotators']))
                    row.append(', '.join(val['robot_annotators']))
                # row.append(val['total_gt'])
            elif action == 'concept-mention':
                row.append(val['start'])
                row.append(val['stop'])
                row.append(val['mention'])
                row.append(val['concept_name'])
                row.append(val['concept_url'])
                row.append(val['area'])
                if mode == 'Human':
                    row.append(', '.join(val['users_list']))
                    row.append(0)
                if mode == 'Robot':
                    row.append(0)
                    row.append(', '.join(val['users_list']))
                if mode == 'both':
                    row.append(', '.join(val['manual_annotators']))
                    row.append(', '.join(val['robot_annotators']))
                # row.append(val['total_gt'])
            row_list.append(row)
    return row_list

