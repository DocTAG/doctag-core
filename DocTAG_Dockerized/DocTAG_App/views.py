from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.shortcuts import redirect
from django.contrib.auth import login as auth_login,authenticate,logout as auth_logout
from django.contrib.auth.models import User as User1
from django.contrib.auth.models import *
from DocTAG_App.utils import *
from DocTAG_App.utils_download import *
from DocTAG_App.utils_upload_files import *
# from DocTAG_App.utils_CERT import *
from django.contrib.auth.decorators import login_required
import hashlib
from django.db import transaction
from django.http import JsonResponse
from DocTAG_App.decorators import *
from datetime import datetime, timezone
from DocTAG_App.utils_configuration_and_update import *
from DocTAG_App.matcher.matcher import *
from DocTAG_App.matcher.logger import *
from django.db import connection

from django.http import HttpResponse


# ExaMode Ground Truth views here.
def index(request):

    """Home page for app (and project)"""

    username = request.session.get('username', False)
    profile = request.session.get('profile', False)
    if(username):
        context = {'username': username,'profile':profile}
        return render(request, 'DocTAG_App/index.html', context)
    else:
        return redirect('DocTAG_App:login')
#


def new_credentials(request):

    """Change session's parameters"""

    error_resp = {'error':'something went wrong with these options'}
    if request.method == 'POST':
        json_resp ={'message':'ok'}
        request_body_json = json.loads(request.body)
        usecase = request_body_json['usecase']
        request.session['usecase'] = usecase
        language = request_body_json['language']
        request.session['language'] = language.lower()
        institute = request_body_json['institute']
        request.session['institute'] = institute
        batch = request_body_json['batch']
        request.session['batch'] = batch
        # topic = request_body_json['topic']
        # request.session['topic'] = topic
        # annotation = request_body_json['annotation']

        # if annotation == 'Automatic':
        #     request.session['mode'] = 'Robot'
        #
        # else:
        request.session['mode'] = 'Human'


        report_type = request_body_json['report_type']
        request.session['report_type'] = report_type

        data = get_fields_from_json()
        request.session['fields'] = data['fields']
        request.session['fields_to_ann'] = data['fields_to_ann']
        if request.session['mode'] == 'Robot':
            workpath = os.path.dirname(os.path.abspath(__file__))  # Returns the Path your .py file is in
            with open(os.path.join(workpath,'./automatic_annotation/auto_fields/auto_fields.json')) as out:
                data = json.load(out)
                request.session['fields_to_ann'] = data['extract_fields'][usecase]

        if request.session['institute'] == 'PUBMED':
            request.session['report_type'] = 'pubmed'
        if request.session['report_type'] == 'pubmed' or request.session['institute'] == 'PUBMED':
            request.session['fields'] = ['volume','year','authors','journal']
            request.session['fields_to_ann'] = ['title','abstract']

        # print(request.session['fields_to_ann'])

        return JsonResponse(json_resp)

    return JsonResponse(error_resp)


def logout(request):

    """Logout: deletion of session's parameters"""

    try:
        del request.session['username']
        del request.session['usecase']
        del request.session['language']
        del request.session['institute']
        del request.session['profile']
        del request.session['fields']
        del request.session['mode']
        del request.session['batch']
        # del request.session['topic']
        del request.session['report_type']
        del request.session['team_member']
        del request.session['fields_to_ann']

        return redirect('DocTAG_App:login')
    except KeyError:
        pass
    finally:
        request.session.flush()

    return redirect('DocTAG_App:login')


def registration(request):

    """This view handles the registration of new users: username, password and profile are inserted in the database"""

    if request.method == 'POST':
        username = request.POST.get('username',None)
        password1 = request.POST.get('password',None)

        profile = request.POST.get('profile',None)
        # mode1 = request.POST.get('mode',None)
        # mode = NameSpace.objects.get(ns_id=mode1)
        if(profile is None):
            context = {'errorMessage': "Please set your profile."}
            return render(request, 'DocTAG_App/registration.html', context)

        if User.objects.filter(username = username).exists() or username == 'Test':
            context = {'errorMessage': "This username is not available. Please, choose another one."}
            return render(request, 'DocTAG_App/registration.html', context)
        try:
            with transaction.atomic():

                password = hashlib.md5(password1.encode()).hexdigest()
                ns_robot = NameSpace.objects.get(ns_id = 'Robot')
                ns_human = NameSpace.objects.get(ns_id = 'Human')
                User.objects.create(username = username,profile=profile,password = password,ns_id=ns_robot)
                User.objects.create(username = username,profile=profile,password = password,ns_id=ns_human)
                request.session['username'] = username
                request.session['mode'] = 'Human'

                request.session['profile'] = profile
                admin = User.objects.filter(profile='Admin')
                admin = admin.first()

                admin_name = admin.username
                request.session['team_member'] = admin_name
                # for usecase in ['colon','uterine cervix','lung']:
                #     groundTruths,groundTruths1 = check_user_agent_gt_presence(username,usecase)
                #     if groundTruths1 > 0:
                #         copy_rows(usecase,'Robot_user',username,None)
                return redirect('DocTAG_App:index')
        except (Exception) as error:
            print(error)
            context = {'errorMessage': "Something went wrong, probably you did not set any profile"}
            return render(request, 'DocTAG_App/registration.html', context)
    return render(request, 'DocTAG_App/registration.html')


def credits(request):

    """Credits page for app"""

    username = request.session.get('username', False)
    profile = request.session.get('profile', False)
    if(username):
        context = {'username': username,'profile':profile}
        return render(request, 'DocTAG_App/index.html', context)
    else:
        return redirect('DocTAG_App:login')


def uploadFile(request):

    """Credits page for app"""

    username = request.session.get('username', False)
    profile = request.session.get('profile', False)
    if(username):
        context = {'username': username,'profile':profile}
        return render(request, 'DocTAG_App/index.html', context)
    else:
        return redirect('DocTAG_App:login')


def configure(request):

    """Configuration page for app """

    username = request.session.get('username', False)
    profile = request.session.get('profile', False)
    if(username):
        context = {'username': username,'profile':profile}
        return render(request, 'DocTAG_App/index.html', context)
    else:
        return redirect('DocTAG_App:login')


def team_members_stats(request):
    """Team members' stats page for app """

    username = request.session.get('username', False)
    profile = request.session.get('profile', False)
    if (username):
        context = {'username': username, 'profile': profile}
        return render(request, 'DocTAG_App/index.html', context)
    else:
        return redirect('DocTAG_App:login')


def updateConfiguration(request):

    """Update Configuration page for app """

    username = request.session.get('username', False)
    profile = request.session.get('profile', False)
    if(username):
        context = {'username': username,'profile':profile}
        return render(request, 'DocTAG_App/index.html', context)
    else:
        return redirect('DocTAG_App:login')


def infoAboutConfiguration(request):

    """Information about Configuration page for app """

    username = request.session.get('username', False)
    profile = request.session.get('profile', False)
    if(username):
        context = {'username': username,'profile':profile}
        return render(request, 'DocTAG_App/index.html', context)
    else:
        return redirect('DocTAG_App:login')


def tutorial(request):

    """Tutorial page for app """

    username = request.session.get('username', False)
    profile = request.session.get('profile', False)
    if(username):
        context = {'username': username,'profile':profile}
        return render(request, 'DocTAG_App/index.html', context)
    else:
        return redirect('DocTAG_App:login')


def my_stats(request):

    """User's reports stats page for app """

    username = request.session.get('username', False)
    profile = request.session.get('profile', False)
    if(username):
        context = {'username': username,'profile':profile}
        return render(request, 'DocTAG_App/index.html', context)
    else:
        return redirect('DocTAG_App:login')

def reports_stats(request):

    """Reports' stats page for app """

    username = request.session.get('username', False)
    profile = request.session.get('profile', False)
    if(username):
        context = {'username': username,'profile':profile}
        return render(request, 'DocTAG_App/index.html', context)
    else:
        return redirect('DocTAG_App:login')


def get_session_params(request):

    """This view returns the current session parameters """

    json_resp = {}
    usecase = request.session.get('usecase',None)
    language = request.session.get('language',None)
    institute = request.session.get('institute',None)
    annotation = request.session.get('mode',None)
    team_member = request.session.get('team_member',None)
    report_type = request.session.get('report_type',None)
    batch = request.session.get('batch',None)
    top_k = request.session.get('top_k',None)

    if batch is not None and report_type is not None and usecase is not None and language is not None and institute is not None and annotation is not None:
        json_resp['usecase'] = usecase
        json_resp['language'] = language
        json_resp['institute'] = institute
        json_resp['team_member'] = team_member
        json_resp['report_type'] = report_type
        json_resp['batch'] = batch
        json_resp['top_k'] = top_k
        if annotation == 'Human':
            json_resp['annotation'] = 'Manual'
        elif annotation == 'Robot':
            json_resp['annotation'] = 'Automatic'
    else:
        json_resp['usecase'] = ''
        json_resp['language'] = ''
        json_resp['institute'] = ''
        json_resp['batch'] = ''
        json_resp['top_key'] = 10
        if User.objects.filter(profile='Admin').exists():
            admin = User.objects.filter(profile='Admin')
            admin = admin.first()
            admin_name = admin.username
            json_resp['team_member'] = admin_name
        else:
            json_resp['team_member'] = 'Test'
        json_resp['annotation'] = ''
        json_resp['report_type'] = ''
    return JsonResponse(json_resp)


def login(request):

    """Login page for app """

    print('login')
    if request.method == 'POST':
        md5_pwd = ''
        admin = False

        username = request.POST.get('username', False)
        mode1 = 'Human'
        mode = NameSpace.objects.get(ns_id=mode1)
        password = request.POST.get('password', False)
        if username:
            username = username.replace("\"", "").replace("'", "")
        if password:
            password = password.replace("\"", "").replace("'", "")
            md5_pwd = hashlib.md5(password.encode()).hexdigest()
        if (username != False and password != False):
            user = User.objects.filter(username = username,ns_id=mode, password = md5_pwd)


            if user.exists():
                # print('LOGGATO')
                mode1 = 'Human'
                mode = NameSpace.objects.get(ns_id=mode1)
                user = User.objects.get(username=username, password=md5_pwd,ns_id=mode)
                print("username: " + username)
                request.session['username'] = username
                request.session['mode'] = mode1

                workpath = os.path.dirname(os.path.abspath(__file__))  # Returns the Path your .py file is in
                with open(os.path.join(workpath, './config_files/config.json')) as out:
                    data = json.load(out)
                    top_k = int(data['TF-IDF_k'])
                    print(top_k)
                request.session['top_k'] = top_k
                admin = User.objects.filter(profile='Admin')
                if admin.exists():
                    admin = admin.first()
                    admin_name = admin.username
                    request.session['team_member'] = admin_name
                else:
                    request.session['team_member'] = 'Test'

                request.session['profile'] = user.profile
                return redirect('DocTAG_App:index')
                #return redirect('DocTAG_App:select_options')

        profile_list = User.objects.values_list('profile', flat=True).distinct()
        if 'Admin' in profile_list:
            admin = True
        context = {'errorMessage': "Your username and password didn't match.","admin":admin}
        return render(request, 'DocTAG_App/login.html', context)

    else:
        username = request.session.get('username', False)
        admin = False
        profile_list = User.objects.values_list('profile', flat=True).distinct()
        if 'Admin' in profile_list:
            admin = True
        context = {'admin': admin}

        if username:
            return redirect('DocTAG_App:index')

        return render(request, 'DocTAG_App/login.html',context)


def annotationlabel(request,action=None):

    """This view handles the GET and POST requestes for LABELS ANNOTATION ACTION

    .js files: Baseindex.js Buttons.js SubmitButtons.js NextPrevButtons.js """

    username = request.session['username']
    mode1 = request.session['mode']
    topic1 = request.session['usecase']
    topic_obj = UseCase.objects.get(name = str(topic1))
    auto_required = request.GET.get('ns_id', None)
    mode = NameSpace.objects.get(ns_id=mode1)

    # print('mode',mode1)
    #usecase = request.session['usecase']
    # language = request.GET.get('language',request.session['language'])
    type = 'labels'

    if request.method == 'GET' and action.lower() == 'user_labels':

        """GET request: given the report, the labels annotated by the user are returned"""

        language = request.GET.get('language', request.session['language'])
        user_get = request.GET.get('username',username)
        # print(user_get)
        report_id = request.GET.get('report_id')
        report1 = Report.objects.get(id_report = report_id,language = language)
        # if auto_required == 'Robot':
        #     mode = NameSpace.objects.get(ns_id=auto_required)
        if auto_required is not None:
            mode_1 = NameSpace.objects.get(ns_id=auto_required)
        else:
            mode_1 = mode
        json_dict = get_user_gt(user_get,mode_1,report1,language,'labels',topic1)
        # print(json_dict)
        return JsonResponse(json_dict,safe=False)

    elif request.method == 'GET' and action.lower() == 'all_labels':

        """ GET request: given the use case, all the labels associated to that usecase are returned. """

        labels = AnnotationLabel.objects.all().values('seq_number','label')
        # print(labels)
        json_dict = {}
        if len(labels) > 0:

            if mode1 == 'Human' or auto_required == 'Human':
                json_dict['labels'] = []
                for el in labels:
                    json_val = {}
                    #if 'Manual' in el['annotation_mode']:
                    # if int(el['seq_number']) > count: # i primi 20 sono inseriti automaticamente
                    json_val['label'] = (el['label'])
                    json_val['seq_number'] = (el['seq_number'])
                    json_dict['labels'].append(json_val)
            # if mode1 == 'Robot' or auto_required == 'Robot':
            #     json_dict['labels'] = []
            #     for el in labels:
            #         json_val = {}
            #         if 'Automatic' in el['annotation_mode']:
            #             json_val['label'] = (el['label'])
            #             json_val['seq_number'] = (el['seq_number'])
            #             json_dict['labels'].append(json_val)

        else:
            json_dict['labels'] = []
        json_dict['labels'] = sorted(json_dict['labels'], key=lambda json: json['seq_number'])
        # print(json_dict)
        return JsonResponse(json_dict)

    elif request.method == 'POST' and action.lower() == 'delete':

        """PSOT request: given the report, the labels the user annotated are removed together with the
         associated groundtruth."""

        request_body_json = json.loads(request.body)
        report_id = request_body_json['report_id']
        user = User.objects.get(username=username,ns_id=mode)
        language = request.GET.get('language', request.session['language'])
        report1 = Report.objects.get(id_report=report_id,language = language)
        if user is None or report1 is None:
            json_response = {'error': 'An error occurred getting parameters.'}
            return json_response
        to_del = Associate.objects.filter(username=user, ns_id=mode, id_report=report1, language=language,name=topic_obj)
        if mode1 == 'Human':
            try:
                with transaction.atomic():

                    if to_del.exists():
                        json_response = delete_all_annotation(to_del, user, report1,language, type,mode,topic_obj)

                    else:
                        json_response = {'msg':'nothing to do'}

            except Exception as error:
                print(error)
                json_response = {'error': 'An error occurred saving the ground_truth and the labels'}
                return JsonResponse(json_response)
            else:
                return JsonResponse(json_response)
        else:
            json_response = {'msg': 'nothing to do'}
            return JsonResponse(json_response)


    if request.method == 'POST' and action.lower() == 'insert':

        """PSOT request: given the report, the labels the user annotated are added in the database and a new 
        JSON groundtruth is created. """

        request_body_json = json.loads(request.body)
        report_id = request_body_json['report_id']
        user = User.objects.get(username=username,ns_id=mode)
        language = request.GET.get('language', request.session['language'])
        report1 = Report.objects.get(id_report=report_id,language = language)

        if user is None or report1 is None:
            json_response = {'error': 'An error occurred getting the parameters.'}
            return JsonResponse(json_response)

        labels_to_save = request_body_json['labels']
        # In this case the user manually deletes all the labels (NOT WITH CLEAR BUTTON) and saves.
        if len(labels_to_save) == 0 and  mode1 == 'Human':

            """If there are not labels to save, if there is a ground truth saved in the database, this is removed,
             otherwise no action is performed. """

            rows = Associate.objects.filter(name = topic_obj,username = user,ns_id=mode, id_report = report1, language = language)
            if rows.exists():
                try:
                    with transaction.atomic():
                        json_response = delete_all_annotation(rows,user,report1,language,type,mode,topic_obj)

                except Exception as error:
                    print(error)
                    json_response = {'error': 'An error occurred.'}
                    return JsonResponse(json_response, status=500)
                else:
                    return JsonResponse(json_response)
            else:
                json_response = {'message': 'Nothing to save.'}
                return JsonResponse(json_response)

        # if len(labels_to_save) == 0 and mode1 == 'Robot':
        #
        #     """ If there are not labels to save and the name space is Robot no action is performed and the already
        #     existing ground-truth is kept """
        #     to_del = Associate.objects.filter(id_report=report1, language=language, username=user, ns_id=mode,name = topic_obj)
        #     # print('RESTORE')
        #     json_response = restore_robot_annotation(report1, 'labels',user)
        #     return JsonResponse(json_response)

        update = True

        """ Check if the user's labels she inserted are as many as the rows already present in the db: 
        if they are not: update the annotation: the old annotation is replaced with the new one
        if they are: check if the labels existing are those inserted, in this case nothing is done, otherwise 
        the current groundtruth is updated. """

        existing_rows = Associate.objects.filter(username = user,ns_id=mode, id_report =report1,language =language,name = topic_obj)
        if existing_rows.exists():
            if existing_rows.count() == len(labels_to_save):
                for label in labels_to_save:
                    label1 = AnnotationLabel.objects.get(label=label['label'], seq_number=label['seq_number'])
                    if not Associate.objects.filter(username=user,ns_id=mode, seq_number=label1.seq_number, label=label1,
                                                    id_report=report1, language=language,name = topic_obj).exists():
                        update = True
                        break
                    else:
                        update = False
        if update == True:
            try:
                with transaction.atomic():
    # Remove all the existing labels inserted by the user for that report. The existing ground truth is kept untile the deletion is successful
                    to_del = Associate.objects.filter(username=user,ns_id=mode, id_report=report1,language = language,name = topic_obj)
                    delete_all_annotation(to_del,user,report1,language,type,mode,topic_obj)

                    json_resp_labels = update_annotation_labels(labels_to_save,user,report1,language,mode,topic_obj)

                    jsonDict = serialize_gt(type, username, report_id,language,mode,topic1)
                    GroundTruthLogFile.objects.create(username=user,ns_id=mode, id_report=report1, language = language,
                                                      gt_json=jsonDict, gt_type=type,insertion_time=Now(),name = topic_obj)

            except (Exception) as error:
                print(error)
                print('rolled back')
                json_response = {'error': 'An error occurred saving the ground_truth '
                                          'and the labels, the transaction rolledback'}
                return JsonResponse(json_response)

            else:
                return JsonResponse(json_resp_labels)
        else:
            if mode1 == 'Human':
                json_response = {'message':'no changes detected'}
                return JsonResponse(json_response)

            # elif mode1 == 'Robot':
            #
            #     """ In this section the name space Robot is handled: If the user is in the AUTOMATIC MODE and the labels
            #     she inserts are those annotated by the algorithm, this means that she agrees with the annotation of the
            #     Robot user. The annotation does not change, only the insertion time is changed."""
            #
            #     try:
            #         with transaction.atomic():
            #             # in questa sezione solo se la gt è uguale a prima, l'utente acconsente alla gt della macchina
            #             user_robot = User.objects.get(username='Robot_user', ns_id=mode)
            #             gt_robot = GroundTruthLogFile.objects.filter(username=user_robot, ns_id=mode,
            #                                                          id_report=report1, language=language,
            #                                                          gt_type='labels',topic = )
            #
            #             gt = GroundTruthLogFile.objects.filter(username=user, ns_id=mode, id_report=report1,
            #                                                    language=language,
            #                                                    gt_type='labels')
            #             if gt.count() == 1 and gt_robot.count() == 1:
            #                 if gt_robot[0].insertion_time == gt[0].insertion_time:
            #                     js = gt[0].gt_json
            #                     GroundTruthLogFile.objects.filter(username=user, ns_id=mode, id_report=report1,
            #                                                       language=language,
            #                                                       gt_type='labels').delete()
            #
            #                     GroundTruthLogFile.objects.create(gt_json=js, insertion_time=Now(), username=user,
            #                                                       ns_id=mode, id_report=report1, language=language,
            #                                                       gt_type='labels')
            #
            #                     ass = Associate.objects.filter(username=user, id_report=report1, language=language,
            #                                                    ns_id=mode).values('label', 'seq_number')
            #                     for el in ass:
            #                         lab = AnnotationLabel.objects.get(label=el['label'], seq_number=el['seq_number'])
            #                         Associate.objects.filter(username=user, ns_id=mode, label=lab, seq_number=lab.seq_number,
            #                                                  id_report=report1, language=language).delete()
            #                         Associate.objects.create(username=user, ns_id=mode, label=lab, seq_number=lab.seq_number,
            #                                                  insertion_time=Now(), id_report=report1, language=language)
            #
            #     except Exception as error:
            #         print(error)
            #         print('rolled back')
            #         json_response = {'error': 'An error occurred updating labels dates'}
            #         return JsonResponse(json_response)
            #     else:
            #         json_response = {'message': 'dates updated'}
            #         return JsonResponse(json_response)


def mention_insertion(request,action=None):
    """
    This view handles the GET and POST requests concerning the mentions identification action

    .js files: Baseindex.js Buttons.js SubmitButtons.js NextPrevButtons.js Association.js"""

    username = request.session['username']
    mode1 = request.session['mode']
    mode = NameSpace.objects.get(ns_id=mode1)
    topic = request.session['usecase']
    topic_obj = UseCase.objects.get(name = topic)
    # language = request.GET.get('language',request.session['language'])
    # print(language)
    #usecase = request.session['usecase']
    type = 'mentions'

    if request.method == 'GET':

        """ GET request: it returns the list of mentions associated to a specific report the user already inserted. """

        report_id = request.GET.get('report_id')
        language = request.GET.get('language', request.session['language'])
        report1 = Report.objects.get(id_report=report_id,language=language)
        user_get = request.GET.get('username',username)
        try:
            # if auto_required == 'Robot':
            #     mode = NameSpace.objects.get(ns_id=auto_required)
            auto_required = request.GET.get('ns_id', None)
            if auto_required is not None:
                mode_1 = NameSpace.objects.get(ns_id=auto_required)
            else:
                mode_1 = mode
            json_dict = get_user_gt(user_get,mode_1,report1,language,'mentions',topic)
            return JsonResponse(json_dict)

        except Exception as error:
            print(error)
            json_response = {'error': 'Sorry, an error occurred during the GET request.'}
            return JsonResponse(json_response,status=500)

    elif request.method == 'POST' and action.lower() == 'delete':

        """POST request: it deletes all the mentions the user inserted for a specific report together with the 
        associated ground-truth."""

        request_body_json = json.loads(request.body)
        report_id = request_body_json['report_id']
        language = request_body_json['language']
        user = User.objects.get(username=username,ns_id=mode)
        report1 = Report.objects.get(id_report=report_id,language = language)
        if user is None or report1 is None:
            json_response = {'error': 'An error occurred getting parameters.'}
            return JsonResponse(json_response,status=500)

        ass = Annotate.objects.filter(username=user,ns_id=mode, id_report=report1.id_report,language = language,name = topic_obj).values('start', 'stop','label')
        if len(ass) == 0:
            json_response = {'message': 'Nothing to delete.'}
            return JsonResponse(json_response)

        if mode1 == 'Human':
            try:
                with transaction.atomic():
                    json_response = delete_all_mentions(user, report1,language, type,mode,topic_obj)

            except (Exception) as error:
                print(error)
                json_response = {'error': 'An error occurred.'}
                return JsonResponse(json_response, status=500)
            else:
                return JsonResponse(json_response)
        else:
            json_resp = {'msg':'ok'}
            return JsonResponse(json_resp)


    elif request.method == 'POST' and action.lower() == 'insert':

        """ POST request: the mentions found by the user (if any) are saved and a ground-truth is created. """

        json_response = {'message':'Mentions and Ground truth saved.'}
        request_body_json = json.loads(request.body)
        report_id = request_body_json['report_id']
        language = request_body_json['language']
        user = User.objects.get(username = username,ns_id=mode)
        report1 = Report.objects.get(id_report = report_id,language = language)
        if user is None or report1 is None:
            json_response = {'error': 'An error occurred getting the parameters.'}
            return JsonResponse(json_response,status=500)

        mentions = request_body_json['mentions']
        # In this case the user manually deletes all the mentions (NOT WITH CLEAR BUTTON) and saves.
        if len(mentions) == 0 and mode1 == 'Human':

            """ If the annotation mode is MANUAL the ground-truth and the annotation of the report is removed. """

            if Annotate.objects.filter(name = topic,username = user,ns_id=mode, id_report =report1,language =language).exists():
                try:
                    with transaction.atomic():
                        json_response = delete_all_mentions(user, report1,language, type,mode,topic)

                except Exception as error:
                    print(error)
                    json_response = {'error': 'An error occurred.'}
                    return JsonResponse(json_response, status=500)
                else:
                    return JsonResponse(json_response)

            else:
                json_response = {'message': 'Nothing to do'}
                return JsonResponse(json_response)

        # if len(mentions) == 0 and mode1 == 'Robot':
        #     """ If the name space is ROBOT the ground-truth and the annotation cannot be removed """
        #     to_del = Annotate.objects.filter(name = topic,username = user,language = language,id_report = report1,ns_id = mode)
        #     json_response = restore_robot_annotation(report1,'mentions',user)
        #     # json_response = {'message': 'Nothing to do'}
        #     return JsonResponse(json_response)

        update = True

        """ Check if the user's mentions she inserted are as many as the rows already present in the db: 
        if they are not: update the annotation: the old annotation is replaced with the new one
        if they are: check if the existing mentions are those inserted, in this case nothing is done, otherwise 
        the current groundtruth is updated."""

        existing_rows = Annotate.objects.filter(username = user,ns_id=mode, id_report =report1,language =language,name = topic_obj)
        if existing_rows.exists():
            if existing_rows.count() == len(mentions):

                for ment in mentions:
                    annoDB = AnnotationLabel.objects.get(label=ment['label'])
                    mentionDB = Mention.objects.filter(start=int(ment['start']),stop=int(ment['stop']),mention_text=ment['mention_text'],
                                                       id_report = report1,language = language)

                    if mentionDB.exists():
                        if mentionDB.count() > 1:
                            json_response = {'error': 'something is wrong in mentions!'}
                            return JsonResponse(json_response, status=500)

                        mentionDB = mentionDB.first()
                        anno = Annotate.objects.filter(username = user,ns_id=mode,name = topic_obj, id_report =report1,language =language,label= annoDB,
                                                        start = mentionDB,stop = mentionDB.stop)
                        if anno.exists():
                            if anno.count() > 1:
                                json_response = {'error': 'something is wrong in annotations!'}
                                return JsonResponse(json_response, status=500)

                            update = False
                        else:
                            update = True
                            break
                    else: # If at lest one mention is different the ground truth and the annotation have to be updated
                        update = True
                        break

        if update == True:
            try:
                with transaction.atomic():
                    json_response = update_mentions(mentions,report1,language,user,mode,topic)
                    if GroundTruthLogFile.objects.filter(username = user,ns_id=mode, language = language, id_report = report1, name = topic_obj,gt_type = 'mentions').exists():
                        GroundTruthLogFile.objects.filter(username=user, ns_id=mode,language=language, id_report=report1,name = topic_obj,
                                                          gt_type='mentions').delete()
                    jsonDict = serialize_gt(type, username, report_id,language,mode,topic)
                    GroundTruthLogFile.objects.create(username=user,ns_id=mode, id_report=report1,language = language,name = topic_obj, gt_json=jsonDict, gt_type=type,
                                                          insertion_time=Now())

            except Exception as error:
                print(error)
                json_response = {'error':'An error occurred trying to save your ground truth.'}
                return JsonResponse(json_response, status=500)
            else:
                return JsonResponse(json_response)

        else:
            if mode1 == 'Human':
                json_response = {'message':'no changes detected'}
                return JsonResponse(json_response)

            # elif mode1 == 'Robot':
            #     try:
            #         with transaction.atomic():
            #             user_robot = User.objects.get(username='Robot_user', ns_id=mode)
            #             gt_robot = GroundTruthLogFile.objects.filter(username=user_robot, ns_id=mode,name = topic,
            #                                                          id_report=report1, language=language,
            #                                                          gt_type='mentions')
            #             gt = GroundTruthLogFile.objects.filter(username=user, ns_id=mode, id_report=report1,name = topic,
            #                                                    language=language,
            #                                                    gt_type='mentions')
            #             if gt.count() == 1 and gt_robot.count() == 1:
            #                 if gt_robot[0].insertion_time == gt[0].insertion_time:
            #                     js = gt[0].gt_json
            #                     GroundTruthLogFile.objects.filter(username=user, ns_id=mode, id_report=report1,
            #                                                       language=language,name = topic,
            #                                                       gt_type='mentions').delete()
            #                     GroundTruthLogFile.objects.create(gt_json=js, insertion_time=Now(), username=user,name = topic,
            #                                                       ns_id=mode, id_report=report1, language=language,
            #                                                       gt_type='mentions')
            #
            #                     ass = Annotate.objects.filter(username=user, id_report=report1, language=language,name = topic,
            #                                                   ns_id=mode).values('start', 'stop')
            #                     for el in ass:
            #                         ment = Mention.objects.get(id_report=report1, language=language,start = el['start'],stop=el['stop'])
            #
            #                         Annotate.objects.filter(username=user, ns_id=mode, start=ment,stop=ment.stop,name = topic,
            #                                                 id_report=report1, language=language).delete()
            #                         Annotate.objects.create(username=user, ns_id=mode,start=ment,stop=ment.stop,name = topic,
            #                                                 insertion_time=Now(), id_report=report1, language=language)
            #     except Exception as error:
            #         print(error)
            #         json_response = {'error': 'An error occurred trying to save your ground truth.'}
            #         return JsonResponse(json_response, status=500)
            #     else:
            #         json_response = {'message': 'dates updated'}
            #         return JsonResponse(json_response)


def insert_link(request,action=None):

    """This view handles ENTITY LINKING action.

    .js files: SubmitButtons.js NextPrevButtons.js Baseindex.js AddAssociation.js Buttons.js"""

    username = request.session['username']
    mode1 = request.session['mode']
    topic = request.session['usecase']
    topic_obj = UseCase.objects.get(name = str(topic))
    mode = NameSpace.objects.get(ns_id=mode1)
    # language = request.GET.get('language',request.session['language'])
    # usecase = request.session['usecase']
    auto_required = request.GET.get('ns_id', None)
    type = 'concept-mention'

    if request.method == 'GET' and action.lower() == 'linked':

        """GET request: it returns the mention-concept associations found by the user for that report."""

        try:
            report_id = request.GET.get('report_id')
            language = request.GET.get('language', request.session['language'])
            user_get = request.GET.get('username',username)
            report1 = Report.objects.get(id_report=report_id,language = language)
            # if auto_required == 'Robot':
            #     mode = NameSpace.objects.get(ns_id=auto_required)
            if auto_required is not None:
                mode_1 = NameSpace.objects.get(ns_id=auto_required)
            else:
                mode_1 = mode
            json_dict = get_user_gt(user_get,mode_1,report1,language,'concept-mention',topic)
            #print(json_dict)
            return JsonResponse(json_dict)
        except Exception as error:
            print(error)
            json_response = {'error': 'An error occurred during the GET request.'}
            return JsonResponse(json_response, status=500)

    if request.method == 'GET' and action.lower() == 'mentions':

        """This GET request returns the list fo mentions associated to the report """

        report_id = request.GET.get('report_id')
        user_get = request.GET.get('username', username)
        language = request.GET.get('language', request.session['language'])
        if auto_required is not None:
            mode_1 = NameSpace.objects.get(ns_id=auto_required)
        else:
            mode_1 = mode
        report1 = Report.objects.get(id_report=report_id,language = language)
        try:
            a = Annotate.objects.filter(name = topic_obj.name,username=user_get,ns_id=mode_1, id_report=report1, language=language).values('start', 'stop','label','seq_number')
            b = Linked.objects.filter(topic_name = topic_obj.name,username=user_get,ns_id=mode_1, id_report=report1, language=language).values('start', 'stop')
            json_dict = {}
            json_dict['mentions1'] = []
            for el in a:
                mention_text = Mention.objects.get(start=int(el['start']), stop=int(el['stop']), id_report=report1,
                                                   language=language)

                json_val = {}
                json_val['start'] = (el['start'])
                json_val['stop'] = (el['stop'])
                json_val['seq_number'] = (el['seq_number'])
                json_val['label'] = (el['label'])
                json_val['mention_text'] = mention_text.mention_text
                json_dict['mentions1'].append(json_val)
            for el in b:
                mention_text = Mention.objects.get(start=int(el['start']), stop=int(el['stop']), id_report=report1,
                                                   language=language)

                json_val = {}
                json_val['start'] = (el['start'])
                json_val['stop'] = (el['stop'])
                json_val['seq_number'] = 0
                json_val['label'] = ''
                json_val['mention_text'] = mention_text.mention_text
                if el['start'] not in [e['start'] for e in json_dict['mentions1']]:
                    json_dict['mentions1'].append(json_val)
            return JsonResponse(json_dict,safe = False)

        except Exception as error:
            print(error)
            json_response = {'error': 'Sorry, an erorr occurred during the GET request.'}
            return JsonResponse(json_response, status=500)

    elif request.method == 'POST' and action.lower() == 'insert_mention':

        """ POST request: insertion of a new mention """

        json_response = {'message': 'Your mentions were correctly inserted'}
        user = User.objects.get(username=username,ns_id=mode)
        request_body_json = json.loads(request.body)
        report_id = request_body_json['report_id']
        language = request_body_json['language']
        mentions = request_body_json['mentions']
        report1 = Report.objects.get(id_report=report_id, language=language)
        if user is None or report1 is None:
            json_response = {'error': 'An error occurred getting the parameters.'}
            return JsonResponse(json_response)

        if len(mentions) > 0:
            try:
                with transaction.atomic():
                    mention = mentions[0]
                    m = Mention.objects.filter(start = mention['start'], stop = mention['stop'], id_report = report1, language = language)
                    if not Mention.objects.filter(start = mention['start'], stop = mention['stop'], id_report = report1, language = language).exists():
                        Mention.objects.create(start = mention['start'], stop = mention['stop'],mention_text = mention['mention_text'], id_report = report1, language = language)
                    # menti = Mention.objects.get(start = mention['start'], stop = mention['stop'], id_report = report1, language = language)
                    # Annotate.objects.create(name = topic_obj,username = user,ns_id=mode, insertion_time = Now(),start = menti, stop = menti.stop, id_report = report1, language = language)
                    # type = 'mentions'
                    # if GroundTruthLogFile.objects.filter(username=user,name = topic_obj, ns_id=mode,id_report=report1, language=language,
                    #                                      gt_type=type).exists():
                    #     GroundTruthLogFile.objects.filter(username=user,name = topic_obj, ns_id=mode,id_report=report1, language=language,
                    #                                       gt_type=type).delete()
                    #
                    # jsonDict = serialize_gt(type, username, report_id, language,mode,topic)
                    # GroundTruthLogFile.objects.create(username=user,ns_id=mode, id_report=report1, language=language,
                    #                                                 gt_json=jsonDict,name = topic_obj,
                    #                                                 gt_type=type, insertion_time=Now())

            except Exception as error:
                print(error)
                json_response = {'error': 'An error occurred trying to save your ground truth.'}
                return JsonResponse(json_response, status=500)
            else:
                return JsonResponse(json_response)

        else:
            json_response = {'message': 'nothing to save'}
            return JsonResponse(json_response)

    elif request.method == 'POST' and action.lower() == 'delete':

        """ POST request: delete the mention-concept associations the user found for that report"""

        request_body_json = json.loads(request.body)
        report_id = request_body_json['report_id']
        language = request_body_json['language']
        user = User.objects.get(username=username,ns_id=mode)
        report1 = Report.objects.get(id_report=report_id,language = language)
        if user is None or report1 is None:
            json_response = {'error': 'An error occurred getting parameters.'}
            return json_response

        to_del = Linked.objects.filter(username=user,ns_id=mode, id_report=report1.id_report,language = language,topic_name = topic_obj)
        if len(to_del) == 0:
            json_response = {'message': 'Nothing to delete.'}
            return JsonResponse(json_response)
        if mode1 == 'Human':
            try:
                with transaction.atomic():
                    json_response = delete_all_associations(user, report1, language, type,mode,topic_obj)
            except Exception as error:
                print(error)
                json_response = {'error': 'Sorry, an erorr occurred, rolled back.'}
                return JsonResponse(json_response,status=500)
            else:
                return JsonResponse(json_response)
        else:
            json_resp = {'msg':'ok'}
            return JsonResponse(json_resp)


    elif request.method == 'POST' and action.lower() == 'insert':

        """ POST request: insert the associations in the db """

        json_response = {'message': 'Associations and Ground truth saved.'}
        request_body_json = json.loads(request.body)
        report_id = request_body_json['report_id']
        language = request_body_json['language']
        user = User.objects.get(username=username,ns_id=mode)
        report1 = Report.objects.get(id_report=report_id,language = language)
        if user is None or report1 is None:
            json_response = {'error': 'An error occurred getting the parameters.'}
            return JsonResponse(json_response)

        concepts = request_body_json['linked']
        # In this case the user manually deletes all the associations (NOT WITH CLEAR BUTTON) and saves.
        if len(concepts) == 0 and mode1 == 'Human':
            if Linked.objects.filter(username=user,ns_id=mode, id_report=report1, language=language,topic_name = topic_obj.name).exists():
                try:
                    with transaction.atomic():
                        json_response = delete_all_associations(user, report1,language, type,mode,topic_obj)
                    return JsonResponse(json_response)
                except Exception as error:
                    print(error)
                    json_response = {'error': 'Sorry, an erorr occurred, rolled back.'}
                    return JsonResponse(json_response, status=500)

            else:
                json_response ={'message':'Nothing to do'}
                return JsonResponse(json_response)
        # if len(concepts) == 0 and mode1 == 'Robot':
        #     """If the user sends 0 associations the robot's ground truth is restored"""
        #     to_del = Linked.objects.filter(username = user, ns_id = mode, id_report = report1,language = language,topic_name = topic_obj)
        #     json_response = restore_robot_annotation(report1, 'concept-mention',user)
        #     # json_response = {'message': 'Nothing to do'}
        #     return JsonResponse(json_response)

        update = True
        existing_rows = Linked.objects.filter(username=user,ns_id=mode, id_report=report1, language=language,topic_name = topic_obj.name)
        if existing_rows.exists():
            if existing_rows.count() == len(concepts):

                for concept in concepts:
                    conc = concept
                    ment = Mention.objects.filter(start=conc['start'], stop=conc['stop'],
                                                       mention_text=conc['mention_text'],
                                                       id_report=report1, language=language)

                    if ment.exists():
                        ment = ment.first()
                        concept_model = Concept.objects.get(concept_url=conc['concept_url'])
                        area = SemanticArea.objects.get(name=conc['semantic_area'])
                        anno = Linked.objects.filter(username=user,ns_id = mode, id_report=report1, language=language,topic_name = topic_obj.name,
                                                       start=ment, stop=ment.stop,concept_url = concept_model,name=area)
                        if anno.exists():
                            update = False
                        else:
                            update = True
                            break
                    else:  # update if at least one association is different
                        update = True
                        break
        if update == True:
            try:
                with transaction.atomic():

                    json_response = update_associations(concepts, user, report1,language,mode,topic_obj)
                    if GroundTruthLogFile.objects.filter(username=user,ns_id=mode, name = topic_obj,language = language,id_report=report1, gt_type='concept-mention').exists():
                        obj = GroundTruthLogFile.objects.filter(name = topic_obj,username=user, ns_id = mode,language = language,id_report=report1, gt_type='concept-mention')
                        obj.delete()
                    jsonDict = serialize_gt(type, username, report_id,language,mode,topic)
                    GroundTruthLogFile.objects.create(username=user,name = topic_obj,ns_id=mode, language = language,id_report=report1, gt_json=jsonDict, gt_type=type,
                                                          insertion_time=Now())
                    return JsonResponse(json_response)

            except Exception as error:
                print(error)
                json_response = {'error': 'An error occurred trying to save your ground truth.'}
                return JsonResponse(json_response,status=500)
        else:
            try:
                with transaction.atomic():
                    if mode1 == 'Human':
                        json_response = {'message': 'no changes detected'}
                        return JsonResponse(json_response)
                    elif mode1 == 'Robot':
                        user_robot = User.objects.get(username='Robot_user',ns_id=mode)
                        gt_robot = GroundTruthLogFile.objects.filter(username=user_robot,name = topic_obj, ns_id=mode, id_report=report1, language=language,
                                                            gt_type='concept-mention')
                        # in questa sezione solo se la gt è uguale a prima, l'utente acconsente alla gt della macchina
                        gt = GroundTruthLogFile.objects.filter(username=user, ns_id=mode, id_report=report1, language=language,name = topic_obj,
                                                            gt_type='concept-mention')
                        if gt.count() == 1 and gt_robot.count() == 1:
                            if gt_robot[0].insertion_time == gt[0].insertion_time:

                                js = gt[0].gt_json
                                GroundTruthLogFile.objects.filter(username=user, ns_id=mode, id_report=report1, language=language,name = topic_obj,
                                                            gt_type='concept-mention').delete()
                                GroundTruthLogFile.objects.create(gt_json=js,insertion_time=Now(),name = topic_obj,username=user,ns_id = mode,id_report = report1,language = language,gt_type='concept-mention')
                                ass = Linked.objects.filter(username=user, id_report=report1, language=language,topic_name = topic_obj, ns_id=mode).values('start','stop','name','concept_url')
                                for el in ass:
                                    men_cur = Mention.objects.get(id_report = report1,language = language, start = el['start'],stop=el['stop'])
                                    sem = SemanticArea.objects.get(name=el['name'])
                                    concept_u = Concept.objects.get(concept_url=el['concept_url'])
                                    Linked.objects.filter(topic_name = topic_obj,username = user,id_report=report1,language=language,ns_id=mode,name=sem,start=men_cur,stop=el['stop'],concept_url = concept_u).delete()
                                    Linked.objects.create(topic_name = topic_obj,username=user,ns_id=mode,id_report = report1,language=language,name=sem,stop=el['stop'],start=men_cur,concept_url=concept_u,insertion_time=Now())

            except Exception as error:
                print(error)
                json_response = {'error': 'An error occurred trying to save your ground truth.'}
                return JsonResponse(json_response, status=500)
            else:
                json_response = {'message': 'dates updated'}
                return JsonResponse(json_response)


def contains(request, action=None):

    """This view handles the GET AND POST requests to insert, delete, get concepts.

    .js files: Baseindex.js Buttons.js SubmitButtons.js NextPrevButtons.js"""

    username = request.session.get('username', False)
    mode1 = request.session.get('mode', False)
    mode = NameSpace.objects.get(ns_id=mode1)
    topic = request.session['usecase']
    topic_obj = UseCase.objects.get(name = topic)
    error_json = {"Error": "No user authenticated"}

    if (username):
        response_json = {}
        if request.method == 'GET':

            """GET request: it returns a list of concepts the user inserted about that report """

            report = request.GET.get('report_id')
            language = request.GET.get('language', request.session['language'])
            user_get = request.GET.get('username',username)
            report1 = Report.objects.get(id_report=report, language = language)
            auto_required = request.GET.get('ns_id',None)
            # if auto_required == 'Robot':
            #     mode = NameSpace.objects.get(ns_id=auto_required)
            if auto_required is not None:
                mode_1 = NameSpace.objects.get(ns_id=auto_required)
            else:
                mode_1 = mode
            response_json = get_user_gt(user_get,mode_1,report1,language,'concepts',topic)
            # print('concetti',response_json)
            return JsonResponse(response_json,safe = False)

        elif request.method == 'POST' and action.lower() == 'insert':

            """ POST request: insert new concepts in the database"""

            request_body_json = json.loads(request.body)
            concepts_list = request_body_json['concepts_list']
            language = request_body_json['language']
            report = request_body_json['report_id']
            report1 = Report.objects.get(id_report=report)

            username = request.session.get('username', False)
            user1 = User.objects.get(username=username,ns_id=mode)
            #usecase = request.session.get('usecase',False)
            type = 'concepts'

            if report is not None and concepts_list is not None:
                user = username
                count = 0
                already_inserted_list = []
                try:
                    with transaction.atomic():
                        for concept in concepts_list:
                            concept = json.loads(concept)
                            concept_url = concept['concept_url']
                            semantic_area = concept['semantic_area']
                            if not check_concept_report_existance(report, concept_url, user,mode, semantic_area,language,topic_obj):
                                # Insert a new record
                                if populate_contains_table(report, concept_url, user,mode, semantic_area,language,topic_obj):
                                    count += 1
                                else:
                                    error_json = {"error message": "insert in table 'contains' failed"}
                                    return JsonResponse(error_json)
                            else:
                                already_inserted_list.append(concept)
                        jsonDict = serialize_gt(type, username, report,language,mode,topic)
                        GroundTruthLogFile.objects.create(username=user1, id_report=report1,ns_id=mode,name = topic_obj,
                                                                        language = language, gt_json=jsonDict,
                                                                        gt_type=type, insertion_time=Now())
                except Exception as error:
                     print(error)
                     print('rolled back')

                if count == len(concepts_list):
                    response_json = {"message": "All concepts inserted successfully"}
                else:
                    response_json = {"message": "Some concepts have been already inserted: ["+ ", ".join(already_inserted_list)+"]"}
            else:
                response_json = {"error": "Missing data"}

        elif request.method == 'POST' and action.lower() == 'update':

            """ POST request: update the concepts that already exist in the database, a new ground truth is created 
            if needed."""

            request_body_json = json.loads(request.body)
            concepts_list = request_body_json['concepts_list']
            report = request_body_json['report_id']
            language = request_body_json['language']
            report1 = Report.objects.get(id_report = report,language = language)
            username = request.session.get('username',False)
            user1 = User.objects.get(username = username,ns_id=mode)
            #usecase = request.session.get('usecase',False)
            type = 'concepts'
            if report is not None and concepts_list is not None:
                user = username
                count = 0
                rows = Contains.objects.filter(topic_name = topic_obj.name,username = user1,ns_id=mode, id_report = report1, language = language)
                if rows.exists() and len(concepts_list) == 0:
                    if mode1 == 'Human':
                        with transaction.atomic():
                            json_response=delete_contains_record(report1, language, None,mode, user, None,topic_obj)
                            # Contains.objects.filter(username = user1,ns_id = mode,id_report = report1,language = language,topic_name = topic_obj.name)
                            # GroundTruthLogFile.objects.filter(username = user1,ns_id = mode,id_report = report1,language = language,name = topic_obj,gt_type = 'concepts').delete()
                            # json_response = {'msg':'ok'}
                            return JsonResponse(json_response,safe=False)
                    # else:
                    #     # json_response = {'message': 'Robot mode, rows can not be deleted'}
                    #     print('RESTORE')
                    #     #json_response = restore_robot_annotation(report1,'concepts',user1)
                    #     return JsonResponse(json_response)
                elif not rows.exists() and len(concepts_list) == 0:
                    json_response = {'message':'nothing to do'}
                    return JsonResponse(json_response)
                if len(concepts_list) == 0:
                    json_response = {'message': 'Nothing to do'}
                    return JsonResponse(json_response)
                update = True
                if rows.exists():
                    if rows.count() == len(concepts_list):
                        for concept in concepts_list:
                            concept_url = concept['concept_url']
                            semantic_area = concept['semantic_area']
                            concept_model = Concept.objects.get(concept_url = concept_url)
                            concepts = Contains.objects.filter(topic_name = topic_obj.name,name=semantic_area, username = user1,ns_id=mode, id_report = report1, language = language, concept_url = concept_model)
                            if concepts.exists():
                                update = False
                            else:
                                update = True
                                break

                # Delete previous data for the specified user and report
                if update == True:
                    try:
                        with transaction.atomic():
                            # delete_contains_record(report1,language, None, mode,user, None,topic_obj)
                            Contains.objects.filter(username=user1, ns_id=mode,id_report=report1,language = language,topic_name = topic).delete()
                            print(Contains.objects.all())
                            # Insert new data
                            for concept in concepts_list:
                                    # Insert a new record
                                    concept_url = concept['concept_url']
                                    semantic_area = concept['semantic_area']
                                    if populate_contains_table(report, concept_url, user, mode,semantic_area,language,topic_obj):
                                        count += 1
                                    else:
                                        error_json = {"error message": "insert in table 'contains' failed"}
                                        return JsonResponse(error_json)
                            jsonDict = serialize_gt(type, username, report,language,mode,topic)
                            if GroundTruthLogFile.objects.filter(username=user1, ns_id=mode,id_report=report1,language = language, gt_type=type,name = topic_obj).exists():
                                GroundTruthLogFile.objects.filter(username=user1,ns_id=mode, id_report=report1, language=language,gt_type=type,name = topic_obj).delete()

                            GroundTruthLogFile.objects.create(username=user1,ns_id=mode, id_report=report1,name = topic_obj,
                                                                            gt_json=jsonDict,language = language,
                                                                            gt_type=type, insertion_time=Now())

                    except Exception as error:
                         print(error)
                         print('rolled back')

                    if count == len(concepts_list):
                        response_json = {"message": "Update successfull"}
                    else:
                        response_json = {"error": "Update unsuccessfull"}
                else:
                    try:
                        with transaction.atomic():
                            if mode1 == 'Human':
                                json_response = {'message': 'no changes detected'}
                                return JsonResponse(json_response)
                            elif mode1 == 'Robot':
                                user_robot = User.objects.get(username='Robot_user', ns_id=mode)
                                gt_robot = GroundTruthLogFile.objects.filter(username=user_robot, ns_id=mode,name = topic_obj,
                                                                             id_report=report1, language=language,
                                                                             gt_type='concepts')
                                # in questa sezione solo se la gt è uguale a prima, l'utente acconsente alla gt della macchina
                                gt = GroundTruthLogFile.objects.filter(username=user1, ns_id=mode, id_report=report1,
                                                                       language=language,name = topic_obj,
                                                                       gt_type='concepts')
                                if gt.count() == 1 and gt_robot.count() == 1:
                                    if gt_robot[0].insertion_time == gt[0].insertion_time:

                                        js = gt[0].gt_json
                                        GroundTruthLogFile.objects.filter(username=user1, ns_id=mode, id_report=report1,name = topic_obj,
                                                                          language=language,
                                                                          gt_type='concepts').delete()
                                        GroundTruthLogFile.objects.create(gt_json=js, insertion_time=Now(),name = topic_obj,
                                                                          username=user1, ns_id=mode, id_report=report1,
                                                                          language=language, gt_type='concepts')
                                        ass = Contains.objects.filter(username=user1, id_report=report1, language=language,name = topic_obj,
                                                                    ns_id=mode).values('name',
                                                                                       'concept_url')
                                        for el in ass:

                                            sem = SemanticArea.objects.get(name=el['name'])
                                            concept_u = Concept.objects.get(concept_url=el['concept_url'])
                                            Contains.objects.filter(username=user1, id_report=report1, language=language,topic_name = topic,
                                                                  ns_id=mode, name=sem,concept_url=concept_u).delete()
                                            Contains.objects.create(username=user1, ns_id=mode, id_report=report1,
                                                                  language=language, name=sem, concept_url=concept_u,topic_name = topic,
                                                                  insertion_time=Now())

                    except Exception as error:
                        print(error)
                        json_response = {'error': 'An error occurred trying to save your ground truth.'}
                        return JsonResponse(json_response, status=500)
                    else:
                        json_response = {'message': 'dates updated'}
                        return JsonResponse(json_response)
            else:
                response_json = {"error": "Missing data"}

        elif request.method == 'POST' and action.lower() == 'delete':

            """ POST request: delete the concepts the user associated to a specific report """

            request_body_json = json.loads(request.body)
            report = request_body_json['report_id']
            language = request_body_json['language']
            username = request.session.get('username', False)
            user1 = User.objects.get(username=username,ns_id=mode)
            report1 = Report.objects.get(id_report = report,language = language)
            with transaction.atomic():
                if report is not None and language is not None:
                    if mode1 == 'Human':
                        response_json = delete_contains_record(report, language, None,mode, user1, None,topic_obj)
                        # Contains.objects.filter(username = user1,ns_id=mode,language=language,id_report = report1,topic_name = topic_obj.name).delete()
                        # GroundTruthLogFile.objects.filter(username=user1, ns_id=mode, language=language, id_report=report1,
                        #                     name=topic_obj,gt_type = 'concepts').delete()
                    # else:
                    #     print('RESTORE')
                    #     response_json = restore_robot_annotation(report1, 'concepts', user1)


                else:
                    response_json = {"Error": "Missing data"}

        return JsonResponse(response_json)

    else:
        return JsonResponse(error_json)


def test(request, table):

    """ This view allows to test the four actions a user can perform."""

    username = request.session.get('username', False)
    error_json = {"Error": "No user authenticated"}

    if (username):
        context = {'username': username}
        if table == "contains":
            return render(request, 'DocTAG_App/test/test-contains.html', context)
        elif table == "associate":
            return render(request, 'DocTAG_App/test/test-annotation.html', context)
        elif table == "annotate":
            return render(request, 'DocTAG_App/test/test-mentions.html', context)
        elif table == 'linked':
            return render(request, 'DocTAG_App/test/test-linked.html', context)

    return JsonResponse(error_json)


def get_reports(request):

    """This view returns the list of reports associated to a single use_case, institute and language

    .js files: Baseindex.js ReportsStats.js ReportSelection.js OptionsModal.js StartingMenu.js ReportForModal.js
    ReportToText.js"""

    inst = request.GET.get('institute',None)
    use = request.GET.get('usec',None)
    lang = request.GET.get('lang',None)
    batch = request.GET.get('batch',None)
    all = request.GET.get('all',None)
    actual_report = request.GET.get('actual_report',None)

    if all == 'all':
        # All the reports are returned independently of the usecase, the language or institute.
        reps = Report.objects.all().values('id_report','report_json','language')
        json_resp = {}
        json_resp['report'] = []

        for report in reps:
            json_rep = {}
            json_rep['id_report'] = report['id_report']
            json_rep['language'] = report['language']
            json_rep['report_json'] = report['report_json']
            json_resp['report'].append(json_rep)
        return JsonResponse(json_resp)

    if(inst != None and use != None and lang != None and batch != None):

        """ It is used in the options modal: if the reuqired combination of institute, language and usecase has 0 reports
         associated, a message is returned. In this case this view returns the number of reports associated to a specific 
         configuration required """

        #rep = Report.objects.filter(institute = inst, name = use, language = lang, batch = batch)
        cursor = connection.cursor()
        cursor.execute("SELECT r.id_report FROM report AS r INNER JOIN topic_has_document AS t ON t.id_report = r.id_report AND r.language = t.language WHERE r.institute=%s AND r.language = %s AND r.batch = %s AND t.name = %s",
                       [str(inst),str(lang),batch,str(use)])
        rep = cursor.fetchall()
        json_count = {'count':len(rep)}
        return JsonResponse(json_count)

    usecase = request.session.get('usecase',None)
    mode1 = request.session.get('mode',None)
    mode = NameSpace.objects.get(ns_id=mode1)
    language = request.session.get('language',None)
    institute = request.session.get('institute',None)
    username = request.session['username']
    batch = request.session['batch']
    token = request.GET.get('configure',None) # This parameter is set when

    jsonError = {'error':'something wrong with params!'}
    if usecase is not None and language is not None and institute is not None and batch is not None:
        # Get the reports associated to the usecase, language and institute of the SESSION
        # reports1 = Report.objects.filter(name = usecase, language = language, institute = institute,batch=batch)
        cursor = connection.cursor()
        cursor.execute(
            "SELECT r.id_report FROM report AS r INNER JOIN topic_has_document AS t ON t.language = r.language AND r.id_report = t.id_report WHERE t.name = %s AND r.language = %s AND r.institute = %s AND r.batch = %s",
            [str(usecase), language, institute, batch])
        reports = cursor.fetchall()
        ids = []
        for rep in reports:
            ids.append(rep[0])
        reports1 = Report.objects.filter(id_report__in=ids,language = language, institute = institute, batch = batch)
        # if mode1 == 'Robot':
        #     gts_r = GroundTruthLogFile.objects.filter(language = language,ns_id=mode).values('id_report')
        #     ids = []
        #     for el in gts_r:
        #         if el['id_report'] not in ids and Report.objects.filter(language = language, id_report = el['id_report'], batch = batch).exists():
        #             ids.append(el['id_report'])
        #
        #     cursor = connection.cursor()
        #     cursor.execute(
        #         "SELECT r.id_report FROM report AS r INNER JOIN topic_has_document AS t ON t.language = r.language AND r.id_report = t.id_report WHERE t.name = %s AND r.language = %s AND r.institute = %s AND r.batch = %s",
        #         [str(usecase), language, institute, batch])
        #     reports = cursor.fetchall()
        #     ids = []
        #     for rep in reports:
        #         ids.append(rep[0])
        #     reports1 = Report.objects.filter(id_report__in=ids,language = language, institute = institute,batch = batch)

        json_resp = {}
        json_resp['report'] = []
        if reports1.exists():
            reports = reports1.values('id_report','report_json','language')
            for report in reports:
                json_rep = {}
                json_rep['id_report'] = report['id_report']
                json_rep['language'] = report['language']
                json_rep['report_json'] = report['report_json']
                json_resp['report'].append(json_rep)

            json_resp['report'].sort(key=lambda json: json['id_report'], reverse=False) # Reports are sorted by ID
            json_resp['index'] = 0

            if token is not None:
                # Get the last ground truth given the session parameters.
                gt = get_last_groundtruth(username, usecase, language, institute,mode,batch)
            else:
                # Get the last ground truth of the user.
                gt = get_last_groundtruth(username,None, None, None,mode,batch)

            if gt is not None:
                # The index is updated and it characterizes the first report of the list shown to the user.
                id_report = gt['id_report']
                # use = gt['use_case']
                lang = gt['language']
                institute = gt['institute']
                # cursor = connection.cursor()

                report_json = Report.objects.get(id_report = id_report, language = lang, institute = institute)
                rep_json = report_json.report_json
                index = json_resp['report'].index({'id_report':id_report,'language':lang,'report_json':rep_json})
                json_resp['index'] = int(index)
            if actual_report is not None:
                index = json_resp['report'].index(actual_report)
                json_resp['index'] = int(index)

        return JsonResponse(json_resp)
    else:
        return JsonResponse(jsonError,status=500)


def get_admin(request):

    """ This view returns the admin of MedTAG (if any)

    .js files: App.js"""

    jsonResp = {}
    jsonResp['admin'] = ''
    if User.objects.filter(profile = 'Admin').exists():
        mode = NameSpace.objects.get(ns_id='Human')
        name = User.objects.get(profile = 'Admin',ns_id=mode)
        admin = name.username
        jsonResp['admin'] = admin

    return JsonResponse(jsonResp)


def check_input_files(request):

    """ This view checks whether the configuration files the user inserted are well formed and returns the response

    .js files: Configure.js"""

    reports = []
    labels = []
    topic = []
    runs = []
    pubmedfiles = []
    concepts = []
    type1 = request.POST.get('type',None)
    username = request.POST.get('username',None)
    # email = request.POST.get('email',None)
    password = request.POST.get('password',None)
    for filename, file in request.FILES.items():
        if filename.startswith('reports'):
            reports.append(file)
            # print(isinstance(file,'InMemoryUploadedFile'))
            #print(str(type(file)) == '<class \'django.core.files.uploadedfile.InMemoryUploadedFile\'>')
        if filename.startswith('pubmed'):
            pubmedfiles.append(file)
        elif filename.startswith('concepts'):
            concepts.append(file)
        elif filename.startswith('labels'):
            labels.append(file)
        elif filename.startswith('runs'):
            runs.append(file)
        elif filename.startswith('topic'):
            topic.append(file)

    # reports = decompress_files(reports)
    jsonDisp = request.POST.get('json_disp','')
    jsonAnn = request.POST.get('json_ann','')
    tfidf = request.POST.get('tfidf',10)
    # load_concepts = request.POST.get('exa_concepts',None)
    # load_labels = request.POST.get('exa_labels',None)
    jsonResp = check_file(reports,pubmedfiles,labels,concepts,jsonDisp,jsonAnn,username,password,topic,runs,tfidf)

    # print(jsonResp)

    return JsonResponse(jsonResp)


def get_gt_list(request):

    """ This view returns the list of groundtruths associated to a user and a specific configuration of institute,
    usecase and language.

    .js files: InfoAboutConfiguration.js DownloadGT.js"""

    groundTruths = 0
    json_resp = {}
    ins = request.GET.get('inst',None)
    lang = request.GET.get('lang',None)
    use = request.GET.get('use',None)
    action = request.GET.get('action',None)
    token = request.GET.get('token',None)
    annotation_mode = request.GET.get('annotation_mode',None)
    if ins == '':
        ins = None
    if use == '':
        use = None
    if lang == '':
        lang = None
    if token == 'all':
        ns_robot = NameSpace.objects.get(ns_id='Robot')
        ns_human = NameSpace.objects.get(ns_id='Human')
        rob_user = User.objects.get(username='Robot_user',ns_id=ns_robot)
        list_gt = GroundTruthLogFile.objects.filter(username = rob_user).count() + GroundTruthLogFile.objects.filter(ns_id=ns_human).count()
        groundTruths = list_gt
        gt_rob = GroundTruthLogFile.objects.filter(ns_id=ns_robot,username = rob_user)

        i = 0
        # print(groundTruths)
        for el in gt_rob:
            gts = GroundTruthLogFile.objects.filter(ns_id=ns_robot,gt_type = el.gt_type,id_report = el.id_report_id,language = el.language).exclude(insertion_time = el.insertion_time)
            gts_count = gts.count()
            # print('count: '+str(i)+' '+str(gts.count()))
            i = i+1
            groundTruths = groundTruths + gts_count


    else:

        if ins is not None and use is not None and lang is not None:
            use = str(use)
            with connection.cursor() as cursor:
                if annotation_mode == 'Human':
                    cursor.execute(
                        "SELECT COUNT(*) FROM report AS r INNER JOIN topic_has_document AS t ON r.id_report = t.id_report AND t.language = r.language INNER JOIN ground_truth_log_file AS g ON g.id_report = r.id_report AND g.language = r.language WHERE r.institute = %s AND t.name = %s AND r.language = %s AND g.gt_type = %s AND g.ns_id = %s",
                        [ins, use, lang,action,'Human'])
                    groundTruths = cursor.fetchone()[0]
                elif annotation_mode == 'Robot':
                    cursor.execute(
                        "SELECT COUNT(*) FROM report AS r INNER JOIN topic_has_document AS t ON r.id_report = t.id_report AND t.language = r.language INNER JOIN ground_truth_log_file AS g ON g.id_report = r.id_report AND g.language = r.language INNER JOIN ground_truth_log_file AS gg ON g.id_report = gg.id_report AND g.language = gg.language AND g.ns_id = gg.ns_id AND g.gt_type = gg.gt_type WHERE r.institute = %s AND t.name = %s AND r.language = %s AND g.gt_type = %s AND g.ns_id = %s AND g.username != %s AND gg.username = %s AND g.insertion_time != gg.insertion_time",
                        [ins, use, lang,action,'Robot','Robot_user','Robot_user'])
                    groundTruths = cursor.fetchone()[0]

        elif ins is not None and use is not None and lang is None:
            with connection.cursor() as cursor:
                if annotation_mode == 'Human':
                    cursor.execute(
                        "SELECT COUNT(*) FROM report AS r INNER JOIN topic_has_document AS t ON r.id_report = t.id_report AND t.language = r.language INNER JOIN ground_truth_log_file AS g ON g.id_report = r.id_report AND g.language = r.language WHERE r.institute = %s AND t.name = %s AND g.gt_type = %s AND g.ns_id = %s",
                        [ins, use,action,'Human'])
                    groundTruths = cursor.fetchone()[0]
                if annotation_mode == 'Robot':
                    cursor.execute(
                        "SELECT COUNT(*) FROM report AS r INNER JOIN topic_has_document AS t ON r.id_report = t.id_report AND t.language = r.language INNER JOIN ground_truth_log_file AS g ON g.id_report = r.id_report AND g.language = r.language INNER JOIN ground_truth_log_file AS gg ON g.id_report = gg.id_report AND g.language = gg.language AND g.ns_id = gg.ns_id AND g.gt_type = gg.gt_type WHERE r.institute = %s AND t.name = %s AND g.gt_type = %s AND g.ns_id = %s AND g.username != %s AND gg.username = %s AND g.insertion_time != gg.insertion_time",
                        [ins, use,action,'Robot','Robot_user','Robot_user'])
                    groundTruths = cursor.fetchone()[0]


        elif ins is None and use is not None and lang is not None:
            with connection.cursor() as cursor:
                if annotation_mode == 'Human':
                    cursor.execute(
                        "SELECT COUNT(*) FROM report AS r INNER JOIN topic_has_document AS t ON r.id_report = t.id_report AND t.language = r.language INNER JOIN ground_truth_log_file AS g ON g.id_report = r.id_report AND r.language = g.language WHERE t.name = %s AND r.language = %s AND g.gt_type = %s AND g.ns_id = %s",
                        [use, lang,action,'Human'])
                    groundTruths = cursor.fetchone()[0]
                if annotation_mode == 'Robot':
                    cursor.execute(
                        "SELECT COUNT(*) FROM report AS r INNER JOIN topic_has_document AS t ON r.id_report = t.id_report AND t.language = r.language INNER JOIN ground_truth_log_file AS g ON g.id_report = r.id_report AND g.language = r.language INNER JOIN ground_truth_log_file AS gg ON g.id_report = gg.id_report AND g.language = gg.language AND g.ns_id = gg.ns_id AND g.gt_type = gg.gt_type WHERE t.name = %s AND r.language = %s AND g.gt_type = %s AND g.ns_id = %s AND g.username != %s AND gg.username = %s AND g.insertion_time != gg.insertion_time",
                        [use, lang,action,'Robot','Robot_user','Robot_user'])
                    groundTruths = groundTruths + cursor.fetchone()[0]



        elif ins is None and use is not None and lang is None:
            with connection.cursor() as cursor:
                if annotation_mode == 'Human':
                    cursor.execute(
                        "SELECT COUNT(*) FROM report AS r INNER JOIN topic_has_document AS t ON r.id_report = t.id_report AND t.language = r.language INNER JOIN ground_truth_log_file AS g ON g.id_report = r.id_report AND r.language = g.language WHERE t.name = %s AND g.gt_type = %s AND g.ns_id = %s",
                        [use,action,'Human'])
                    groundTruths = cursor.fetchone()[0]
                if annotation_mode == 'Robot':
                    cursor.execute(
                        "SELECT COUNT(*) FROM report AS r INNER JOIN topic_has_document AS t ON r.id_report = t.id_report AND t.language = r.language INNER JOIN ground_truth_log_file AS g ON g.id_report = r.id_report AND g.language = r.language INNER JOIN ground_truth_log_file AS gg ON g.id_report = gg.id_report AND g.language = gg.language AND g.ns_id = gg.ns_id AND g.gt_type = gg.gt_type WHERE t.name = %s  AND g.gt_type = %s AND g.ns_id = %s AND g.username != %s AND gg.username = %s AND g.insertion_time != gg.insertion_time",
                        [use, action,'Robot','Robot_user','Robot_user'])
                    groundTruths = cursor.fetchone()[0]



    json_resp['ground_truths'] = groundTruths
    # print(json_resp)
    return JsonResponse(json_resp)


def check_files_for_update(request):

    """ This view checks whether the files inserted by the user to update the configuration are well formed

    .js files: UpdateConfiguration.js"""

    reports = []
    pubmedfiles = []
    topic = []
    runs = []
    labels = []
    concepts = []
    type1 = request.POST.get('type',None)
    for filename, file in request.FILES.items():
        if filename.startswith('reports'):
            reports.append(file)
        if filename.startswith('pubmed'):
            pubmedfiles.append(file)
        elif filename.startswith('concepts'):
            concepts.append(file)
        elif filename.startswith('labels'):
            labels.append(file)
        elif filename.startswith('topic'):
            topic.append(file)
        elif filename.startswith('runs'):
            runs.append(file)
            
    reports = decompress_files(reports)
    jsonDisp = request.POST.get('json_disp',None)
    jsonAnn = request.POST.get('json_ann',None)
    jsonDispUp = request.POST.get('json_disp_update',None)
    jsonAnnUp = request.POST.get('json_ann_update',None)
    tf_idf = request.POST.get('tf_idf', 10)
    # load_concepts = request.POST.get('exa_concepts',None)
    # load_labels = request.POST.get('exa_labels',None)
    msg = check_for_update(type1,pubmedfiles,reports,labels,concepts,jsonDisp,jsonAnn,jsonDispUp,jsonAnnUp,topic,runs,tf_idf)
    jsonResp = {'message':msg}
    return JsonResponse(jsonResp)


def update_db(request):

    """ This view handles the update of the database once the files check went well

     .js files: UpdateConfiguration.js"""

    reports = []
    pubmedfiles = []
    labels = []
    concepts = []
    runs = []
    topic = []
    tf_idf = request.POST.get('tfidf', None)


    for filename, file in request.FILES.items():
        if filename.startswith('reports'):
            reports.append(file)
        if filename.startswith('pubmed'):
            pubmedfiles.append(file)
        elif filename.startswith('concepts'):
            concepts.append(file)
        elif filename.startswith('labels'):
            labels.append(file)
        elif filename.startswith('topic'):
            topic.append(file)
        elif filename.startswith('runs'):
            runs.append(file)

    reports = decompress_files(reports)
    jsonDisp = request.POST.get('json_disp', None)
    jsonAnn = request.POST.get('json_ann', None)
    jsonDispUp = request.POST.get('json_disp_update', '')
    jsonAnnUp = request.POST.get('json_ann_update', '')
    jsonAll = request.POST.get('json_all_update', '')
    # load_concepts = request.POST.get('exa_concepts',None)
    # load_labels = request.POST.get('exa_labels',None)
    batch = request.POST.get('batch',None)
    #print(batch)
    msg = update_db_util(reports,pubmedfiles,labels,concepts,jsonDisp,jsonAnn,jsonDispUp,jsonAnnUp,jsonAll,topic,runs,batch,tf_idf)
    if 'message' in list(msg.keys()):
        keys = get_fields_from_json()
        request.session['fields'] = keys['fields']
        request.session['fields_to_ann'] = keys['fields_to_ann']
        # if type1 == 'reports':
        #     get_fields_extractable('update')

    # if request.session['mode'] == 'Robot':
    #
    #     # fields = UseCase.objects.get(name=usecase)
    #     # fields_to_extr = fields.extract_fields
    #     # request.session['fields_to_ann'] = fields_to_extr
    #
    #     workpath = os.path.dirname(os.path.abspath(__file__))  # Returns the Path your .py file is in
    #     with open(os.path.join(workpath, './automatic_annotation/auto_fields/auto_fields.json')) as out:
    #         data = json.load(out)
    #         request.session['fields_to_ann'] = data['extract_fields'][usecase]

    return JsonResponse(msg)


def configure_db(request):

    """ This view handles the initial configuration, the first the admin performs

    .js files: Configure.js"""

    reports = []
    pubmedfiles = []
    areas = []
    labels = []
    concepts = []
    runs = []
    topic = []
    tf_idf = request.POST.get('tf_idf',10)
    workpath = os.path.dirname(os.path.abspath(__file__))  # Returns the Path your .py file is in
    path1 = os.path.join(workpath, './config_files/config.json')
    g = open(path1,'r')
    data = json.load(g)
    data['TF-IDF_k'] = tf_idf
    with open(path1,'w') as f:
        json.dump(data,f)


     # load_labels = request.POST.get('exa_labels',None)

    for filename, file in request.FILES.items():
        if filename.startswith('reports'):
            reports.append(file)
        elif filename.startswith('pubmed'):
            pubmedfiles.append(file)
        elif filename.startswith('areas'):
            areas.append(file)
        elif filename.startswith('concepts'):
            concepts.append(file)
        elif filename.startswith('labels'):
            labels.append(file)
        elif filename.startswith('runs'):
            runs.append(file)
        elif filename.startswith('topic'):
            topic.append(file)
            
    reports = decompress_files(reports)
    jsonDisp = request.POST.get('json_disp',None)
    jsonAnn = request.POST.get('json_ann',None)
    jsonAll = request.POST.get('json_all',None)
    username = request.POST.get('username',None)
    password = request.POST.get('password',None)

    msg = configure_data(pubmedfiles,reports,labels,concepts,jsonDisp,jsonAnn,jsonAll,username,password,topic,runs,tf_idf)

    # if 'message' in list(msg.keys()):
    #     get_fields_extractable('configure')
    return JsonResponse(msg)


def get_keys(request):

    """ This view returns the list of all the distinct keys present in the json reports. This view is called
     during configuration

     .js files: UpdateConfiguration.js """

    keys=[]
    reports = Report.objects.all().exclude(institute = 'PUBMED')
    for report in reports:
        json_rep = report.report_json
        for el in json_rep.keys():
            if el not in keys:
                keys.append(el)
    json_resp = {'keys':keys}
    return JsonResponse(json_resp)


def download_ground_truths(request):

    """This view returns the ground truths created by the user according to the configuration she required.

    .js files: DownloadGT.js """

    workpath = os.path.dirname(os.path.abspath(__file__))  # Returns the Path your .py file is in
    path1 = os.path.join(workpath, './static/temp/temp.csv')
    path2 = os.path.join(workpath, './static/BioC/temp_files/to_download.csv')
    if os.path.exists(path1):
        os.remove(path1)
    if os.path.exists(path2):
        os.remove(path2)
    username = request.session['username']
    inst = request.GET.get('institute','default')
    if inst == '':
        inst = None
    else:
        inst = str(inst)
    use = request.GET.get('usec',None)
    if use == '':
        use = None
    else:
        use = str(use)
    report_type = request.GET.get('report_type',None)
    if report_type == '':
        report_type = None
    annotation_mode = request.GET.get('mode',None)
    if annotation_mode == '':
        annotation_mode = None
    lang = request.GET.get('lang',None)
    if lang == '':
        lang = None
    else:
        lang = str(lang)
    batch = request.GET.get('batch','')
    if batch == '' or batch == 'all':
        batch = None
    else:
        batch = int(batch)

    all = request.GET.get('all_gt',None)
    action = request.GET.get('action',None)
    format = request.GET.get('format',None)
    json_resp = {}
    json_resp['ground_truth'] = []
    if format == 'json' or all =='all' :
        json_resp = create_json_to_download(report_type,action,username,use,annotation_mode,inst,lang,all,batch)
        return JsonResponse(json_resp)

    elif format == 'csv':
        response = HttpResponse(content_type='text/csv')
        resp = create_csv_to_download(report_type,annotation_mode,username,use,inst,lang,action,response,batch)
        return resp

    elif format == 'biocxml':
        json_keys_to_display = request.session['fields']
        json_keys_to_ann = request.session['fields_to_ann']
        if report_type == 'pubmed':
            json_keys_to_display = ['year','authors','volume','journal']
            json_keys_to_ann = ['title','abstract']
        json_keys = json_keys_to_display + json_keys_to_ann
        resp = generate_bioc(json_keys,json_keys_to_ann,username,action,lang,use,inst,'xml',annotation_mode,report_type,batch)
        return HttpResponse(resp,content_type='application/xml')

    elif format == 'biocjson':
        json_keys_to_display = request.session['fields']
        json_keys_to_ann = request.session['fields_to_ann']
        json_keys = json_keys_to_display + json_keys_to_ann
        resp = generate_bioc(json_keys,json_keys_to_ann,username,action,lang,use,inst,'json',annotation_mode,report_type,batch)
        return HttpResponse(resp,content_type='application/xml')


def download_all_ground_truths(request):

    """This view returns ALL the ground truths to be downloaded. This view can be called only by the admin and the
    ground truths returned are those of ALL the users in the platform

    .js files: InfoAboutConfiguration.js UpdateConfiguration.js """

    json_resp = {}
    json_resp['ground_truth'] = []
    cursor = connection.cursor()
    mode = request.GET.get('gt_mode',None)
    if mode is None:
        human = NameSpace.objects.get(ns_id = 'Human')
        robot = NameSpace.objects.get(ns_id = 'Robot')
        gt_human = GroundTruthLogFile.objects.filter(ns_id = human)
        agent = User.objects.get(ns_id = robot,username = 'Robot_user')
        gt_robot = GroundTruthLogFile.objects.filter(ns_id = robot,username = agent)
        for el in gt_human:
            gt_json = el.gt_json
            if gt_json['gt_type'] == 'concept-mention':
                gt_json['gt_type'] = 'linking'
            json_resp['ground_truth'].append(gt_json)
        for el in gt_robot:
            gt_json = el.gt_json
            if gt_json['gt_type'] == 'concept-mention':
                gt_json['gt_type'] = 'linking'
            json_resp['ground_truth'].append(gt_json)
        cursor.execute("SELECT g.gt_json FROM ground_truth_log_file AS g INNER JOIN ground_truth_log_file AS gg ON g.id_report = gg.id_report AND g.language = gg.language AND g.gt_type = gg.gt_type AND g.id_report = gg.id_report AND g.ns_id = gg.ns_id WHERE g.ns_id = %s AND g.username != %s AND gg.username = %s AND g.insertion_time != gg.insertion_time",['Robot','Robot_user','Robot_user'])
        ans = cursor.fetchall()
        for el in ans:
            gt_json = json.loads(el[0])
            if gt_json['gt_type'] == 'concept-mention':
                gt_json['gt_type'] = 'linking'
            json_resp['ground_truth'].append(gt_json)

    # elif mode.lower() == 'automatic':
    #     cursor.execute(
    #         "SELECT g.gt_json FROM ground_truth_log_file AS g INNER JOIN ground_truth_log_file AS gg ON g.id_report = gg.id_report AND g.language = gg.language AND g.gt_type = gg.gt_type AND g.id_report = gg.id_report AND g.ns_id = gg.ns_id WHERE g.ns_id = %s AND g.username != %s AND gg.username = %s AND g.insertion_time != gg.insertion_time",
    #         ['Robot', 'Robot_user', 'Robot_user'])
    #     ans = cursor.fetchall()
    #     for el in ans:
    #         gt_json = json.loads(el[0])
    #
    #         if gt_json['gt_type'] == 'concept-mention':
    #             gt_json['gt_type'] = 'linking'
    #         json_resp['ground_truth'].append(gt_json)

    return JsonResponse(json_resp)


def download_key_files(request):

    """This view returns the key files of BioC mentions and linking.

    .js files: DownloadGT.js DownloadForModal.js """

    workpath = os.path.dirname(os.path.abspath(__file__))  # Returns the Path your .py file is in
    path = os.path.join(workpath, './static/BioC/linking.key')
    path1 = os.path.join(workpath, './static/BioC/mention.key')
    ment = request.GET.get('type_key',None)
    if ment == 'mentions':
        path = open(path1, 'r')
        return HttpResponse(path, content_type='text/plain')
    elif ment == 'linking':
        path1 = open(path, 'r')
        return HttpResponse(path1, content_type='text/plain')


def get_reports_from_action(request):

    """This view returns an array of tuples, where each tuple contains the id of the annotated report and the associated insertion time

     .js files: ReportSelection.js """

    username = request.session['username']
    mode1 = request.session['mode']
    topic = request.session['usecase']
    mode = NameSpace.objects.get(ns_id=mode1)
    language = request.session['language']
    report_to_ret = []
    action = request.GET.get('action',None)
    user = User.objects.get(username = username,ns_id=mode)
    cursor = connection.cursor()
    cursor.execute("SELECT r.id_report,r.insertion_time FROM ground_truth_log_file AS r INNER JOIN topic_has_document AS t ON t.id_report = r.id_report AND t.language = r.language WHERE r.language = %s AND t.name = %s AND r.ns_id = %s AND r.gt_type = %s AND r.username = %s ORDER BY insertion_time DESC",[language,topic,mode1,action,username])
    ans = cursor.fetchall()

#    gt = GroundTruthLogFile.objects.filter(id_report__in = reports,username = user,ns_id=mode, language = language, gt_type = action).order_by('-insertion_time')
    if len(ans) > 0 :
        if mode1 == 'Human':
            for element in ans:
                val = (element[0],element[1].replace(tzinfo=timezone.utc).astimezone(tz=None))
                report_to_ret.append(val)
        #
        # elif mode1 == 'Robot':
        #     user_rob = User.objects.get(username = 'Robot_user',ns_id = mode)
        #     for el in gt:
        #         gt_rob = GroundTruthLogFile.objects.get(id_report = el.id_report_id, language = language, gt_type = el.gt_type,ns_id=mode, username=user_rob)
        #         if el.insertion_time != gt_rob.insertion_time:
        #             val = (el.id_report_id, el.insertion_time.replace(tzinfo=timezone.utc).astimezone(tz=None))
        #             report_to_ret.append(val)

    jsonDict = {}
    jsonDict['reports_presence'] = report_to_ret
    # print(jsonDict)
    return JsonResponse(jsonDict)


def get_last_gt(request):

    """ This view returns the last ground truth created by the user for the session's parameters

    .js files: Baseindex.js """

    username = request.session['username']
    mode1 = request.session['mode']
    mode = NameSpace.objects.get(ns_id=mode1)
    language = request.session['language']
    usecase = request.session['usecase']
    institute = request.session['institute']
    batch = request.session['batch']
    jsonDict = {}
    token = request.GET.get('configure',None)
    if token is None:
        gt_json = get_last_groundtruth(username,None,None,None,mode,batch)
    else:
        gt_json = get_last_groundtruth(username,usecase,language,institute,mode,batch)

    if gt_json is None:
        jsonDict['groundtruth'] = ''
        jsonDict['report'] = ''
        jsonDict['report_id'] = ''
    else:
        jsonDict['groundtruth'] = gt_json
        id_report = gt_json['id_report']
        language = gt_json['language']
        report = Report.objects.get(id_report=id_report, language=language)
        jsonDict['report'] = report.report_json
        jsonDict['report_id'] = id_report
    return JsonResponse(jsonDict)


def conc_view(request):

    """ This view returns the concept_urls related to each semantic_area. The concepts can be those added by the admin
    (in the manual mode), those of EXAMODE added EXCLUSIVELY for automatic annotation (in the automatic mode) or those
    of EXAMODE added for automatic AND manual mode.

    .js files: SubmitButtons.js Baseindex.js """

    usecase = request.session['usecase']
    mode = request.session['mode']
    auto_required = request.GET.get('ns_id',None)
    jsonDict = {}
    concepts = {}
    notEmpty = False
    jsonDict['concepts'] = []
    if mode == 'Human' or auto_required == 'Human':
        cursor = connection.cursor()
        cursor.execute("SELECT DISTINCT b.name FROM belong_to as b inner join concept as c on c.concept_url = b.concept_url")
        ar = cursor.fetchall()
        areas = []
        for el in ar:
            areas.append(el[0])
        for area in areas:
            name = area
            concepts[name] = []
            concepts_list_final = get_concepts_by_usecase_area(usecase, name,'Human')
            for c in concepts_list_final:
                if c not in concepts[name]:
                    concepts[name].append(c)
                    notEmpty = True
        if notEmpty == True:
            jsonDict['concepts'] = concepts

    # elif mode == 'Robot' or auto_required == 'Robot':
    #     with transaction.atomic():
    #         with connection.cursor() as cursor:
    #
    #             areas = ['Diagnosis', 'Test', 'Procedure', 'Anatomical Location']
    #             for area in areas:
    #                 concepts[area] = get_concepts_by_usecase_area(usecase, area, 'Robot')
    #                 if len(concepts[area]) > 0:
    #                     notEmpty = True
    #             if notEmpty == True:
    #                 jsonDict['concepts'] = concepts
    #                 print(concepts)

    return JsonResponse(jsonDict)


def get_semantic_area(request):

    """ This view returns the semantic areas: fi the session's mode is ROBOT (automatic annotation) we look for those
    concepts whose provenance is EXAMODE otherwise we look for those concepts whose insertion author is ADMIN.

    .js files: Baseindex.js SubmitButtons.js """

    json_dict = {}
    arr = []
    arr_sem = SemanticArea.objects.all().values('name')
    for area in arr_sem:
        arr.append(area['name'])
    areas = []
    auto_required = request.GET.get('ns_id',None)
    if request.session['mode'] == 'Robot' or auto_required == 'Robot':
        with connection.cursor() as cursor:
            areas = ['Diagnosis','Test','Procedure','Anatomical Location']

    elif request.session['mode'] == 'Human' or auto_required == 'Human':
        with connection.cursor() as cursor:
            cursor.execute(
                'SELECT DISTINCT(b.name) FROM concept AS c INNER JOIN belong_to AS b ON c.concept_url = b.concept_url ')
            rows = cursor.fetchall()
            for row in rows:
                areas.append(row[0])
    json_dict['area'] = areas
    # print('areas',areas)
    return JsonResponse(json_dict)


def report(request,report_id,language):

    """ This view returns the json report of the required report

    .js files: USED ONLY DURING DEBUG """

    json_resp = {}
    error_json = {'error':'the report does not exist!'}

    if Report.objects.filter(id_report = report_id, language = language).exists():
        report = Report.objects.get(id_report = report_id, language = language)
        json_resp['report_json'] = report.report_json
        return JsonResponse(json_resp['report_json'])

    return error_json


def report_start_end(request):

    """ This view returns for each key of the json report required its text, the indexes of the start and stop chars
    in the json report string and the number of words that compose the fields to annotate.

    .js files: Baseindex.js SubmitButtons.js ReportToText.js ReportForModal.js  """

    report = request.GET.get('report_id')
    lang = request.GET.get('language',None)
    usecase = request.session['usecase']
    data = get_fields_from_json()
    json_keys_to_display = data['fields']
    json_keys_to_display.extend(['journal','authors','year','volume'])
    json_keys_to_ann = data['fields_to_ann']
    json_keys = (data['all_fields'])

    language = request.session['language']
    request_auto = request.GET.get('ns_id',None)
    if request_auto is not None and request_auto == 'Robot' and request.session['institute'] != 'PUBMED':
        # In this case we require automatic annotation: the keys to annotate change
        workpath = os.path.dirname(os.path.abspath(__file__))  # Returns the Path your .py file is in
        with open(os.path.join(workpath,'./automatic_annotation/auto_fields/auto_fields.json')) as out:
            data = json.load(out)
            json_keys = data['total_fields'][usecase]
            json_keys_to_ann = data['extract_fields'][usecase]
            for el in json_keys_to_ann:
                if el in json_keys_to_display:
                    json_keys_to_display.remove(el)

    json_keys.extend(['journal', 'authors', 'year', 'volume', 'abstract', 'title'])
    json_keys_to_ann.extend(['abstract', 'title'])
    if lang is not None:
        language = lang
    json_dict = report_get_start_end(json_keys,json_keys_to_ann,report,language)
    # print(json_dict)
    return JsonResponse(json_dict)


def get_usecase_inst_lang(request):

    """ This view returns the list of all the possible: usecases, languages and institutes.

    .js files: App.js UpdateConfiguration.js Configure.js ReportsStats.js Credits.js MyStats.js Tutorial.js """

    jsonDict = get_distinct()
    return JsonResponse(jsonDict)


def get_fields(request):

    """This view returns the fields to display and annotate. If the annotation mode is automatic the fields to annotate
    are those the concepts and mentions have been extracted from. The fields are returned to give the user the chance to
    update the fields she wants to display/annotate in MANUAL CONFIGURATION.

    .js files: Baseindex.js SubmitButtons.js UpdateConfiguration.js ReportsStats.js ReportForModal.js ReportToText.js"""

    json_resp = {}
    json_resp['fields'] = []
    json_resp['fields_to_ann'] = []
    all = request.GET.get('all',None)
    workpath = os.path.dirname(os.path.abspath(__file__))  # Returns the Path your .py file is in
    auto_request = request.GET.get('ns_id', None)
    report = request.GET.get('report', None)
    # print(request.session['report_type'])
    if report is not None or all == 'all':
        if report is not None:
            if report.startswith('PUBMED_'):
                json_resp['fields'] = ['volume','authors','year','journal']
                json_resp['fields_to_ann'] = ['title','abstract']
            else:
                json_resp = get_fields_from_json()
        if all == 'all':
            # All the possible fields for every usecase (MANUAL CONFIGURATION)
            json_resp = get_fields_from_json()
            if Report.objects.filter(institute = 'PUBMED').exists():
                json_resp['all_fields'].extend(['title','abstract','volume','journal','year','authors']) #aggiungo pubmed solo in coda!
    else:
        if request.session['report_type'] == 'pubmed':
            json_resp['fields'] = ['volume','authors','year','journal']
            json_resp['fields_to_ann'] = ['title','abstract']
        else:
            # Fileds related exclusively to a usecase
            json_resp = get_fields_from_json_configuration(request.session['usecase'],request.session['institute'],request.session['language'])
            if request.session['mode'] == 'Robot' or auto_request == 'Robot':
                with open(os.path.join(workpath, './automatic_annotation/auto_fields/auto_fields.json')) as out:
                    data = json.load(out)
                    json_resp['fields_to_ann'] = data['extract_fields'][request.session['usecase']]
                    for el in json_resp['fields_to_ann']:
                        if el in json_resp['fields']:
                            json_resp['fields'].remove(el)
    # print('FIELDS', json_resp)
    return JsonResponse(json_resp)


def download_examples(request):

    """ This view creates the HttpResponse object with the CSV examples files, these are the examples the user can
    download.

    .js files: Cofnigure.js InfoAboutConfiguration.js UpdateConfiguration.js """

    file_required = request.GET.get('token',None)
    path = ''
    workpath = os.path.dirname(os.path.abspath(__file__))  # Returns the Path your .py file is in
    if file_required == 'reports':
        path = os.path.join(workpath, './static/examples/report.csv')

    elif file_required == 'concepts':
        path = os.path.join(workpath, './static/examples/concept.csv')

    elif file_required == 'labels':
        path = os.path.join(workpath, './static/examples/labels.csv')

    elif file_required == 'pubmed':
        path = os.path.join(workpath, './static/examples/pubmed.csv')

    elif file_required == 'topic':
        path = os.path.join(workpath, './static/examples/topic.csv')

    elif file_required == 'runs':
        path = os.path.join(workpath, './static/examples/runs.csv')

    content = open(path,'r')
    return HttpResponse(content, content_type='text/csv')


def download_templates(request):

    """ This view creates the HttpResponse object with the appropriate CSV header, these are the templates the user can
    download.

    .js files: InfoAboutConfiguration.js """

    file_required = request.GET.get('token',None)
    path = ''
    workpath = os.path.dirname(os.path.abspath(__file__))  # Returns the Path your .py file is in

    if file_required == 'reports':
        path = os.path.join(workpath, './static/templates/report.csv')

    elif file_required == 'concepts':
        path = os.path.join(workpath, './static/templates/concept.csv')

    elif file_required == 'labels':
        path = os.path.join(workpath, './static/templates/labels.csv')

    elif file_required == 'pubmed':
        path = os.path.join(workpath, './static/templates/pubmed.csv')

    elif file_required == 'topic':
        path = os.path.join(workpath, './static/examples/topic.csv')

    elif file_required == 'runs':
        path = os.path.join(workpath, './static/examples/runs.csv')

    content = open(path,'r')
    return HttpResponse(content, content_type='text/csv')


def get_keys_and_uses_from_csv(request):

    """This view returns the list of all the keys found in report files (other than institute,usecase,id_report,language)
    and the list of usecases, this list contains the usecases where automatic annotation can be applied.

    .js files: Configure.js"""


    reports = []
    json_resp = {}
    keys = []
    uses = []
    for filename, file in request.FILES.items():
        if filename.startswith('reports'):
            reports.append(file)

    reports = decompress_files(reports)
    try:
        keys,uses,final_uses = get_keys_and_uses_csv(reports)


        uses = list(map(lambda x: x.lower(), uses))
        final_uses = list(map(lambda x: x.lower(), final_uses))

    except Exception as e:
        print(e)
        pass
    finally:
        json_resp['uses'] = list(uses)
        json_resp['keys'] = keys
        # print(keys)
        return JsonResponse(json_resp)


def get_keys_from_csv_update(request):

    """This view returns the list of all the keys found in report files (other than institute,usecase,id_report,language)
    the admin has just inserted to update the database (only the keys that have never been detected before are returned).

    .js files: UpdateConfiguration.js"""

    reports = []
    json_resp = {}
    for filename, file in request.FILES.items():
        if filename.startswith('reports'):
            reports.append(file)
        elif filename.startswith('pubmed'):
            reports.append(file)

    keys,uses = get_keys_csv_update(reports)
    json_resp['keys'] = keys
    json_resp['uses'] = list(uses)
    # print('CHIAVI',keys)
    return JsonResponse(json_resp)


# def get_presence_examode_concepts(request):
#
#     """This view returns the list of usecases (colon,uterine cervix,lung) for which the examode concepts have not been added
#     in the database.
#
#     .js files: UpdateConfiguration.js"""
#
#     json_resp = {}
#     json_resp['concepts'] = get_presence_exa_concepts()
#     json_resp['labels'] = get_presence_exa_labels()
#     # print(json_resp)
#     return JsonResponse(json_resp)

#----------------------------------------------------------------------------------------------------------
# REPORT USER'S STATA
def get_stats_array_per_usecase(request):

    """This view returns for each usecase the statistics concerning the user's annotations

    .js files: MyStats.js"""

    mode = request.GET.get('mode',None)
    usern = request.GET.get('member',request.session['username'])
    username = User.objects.get(username=usern, ns_id=mode)
    json_dict = {}
    json_dict['medtag'] =  get_array_per_usecase(username,mode)
    json_dict['pubmed'] =  get_array_per_usecase_PUBMED(username,mode)
    # print(json_dict)
    return JsonResponse(json_dict)



def get_data(request):

    """This view returns the rows to be inserted in the reports' table

    .js files: ReportsStats.js"""

    json_resp = {}
    reports = Report.objects.all()
    json_resp['reports'] = []
    indice = 0
    # st = time.time()
    for el in reports:
        # print(str(indice))
        indice +=1
        report = Report.objects.get(id_report=el.id_report, language=el.language)
        language = el.language
        ns_human = NameSpace.objects.get(ns_id='Human')
        ns_robot = NameSpace.objects.get(ns_id='Robot')

        # gt_human = GroundTruthLogFile.objects.filter(id_report = report, language = language, ns_id = ns_human).count()
        # cursor = connection.cursor()
        # cursor.execute("SELECT * FROM ground_truth_log_file AS g INNER JOIN ground_truth_log_file AS gg ON gg.id_report = g.id_report AND gg.language = g.language AND g.ns_id = gg.ns_id AND g.gt_type = gg.gt_type WHERE g.insertion_time != gg.insertion_time AND g.ns_id = %s AND g.username != %s AND gg.username = %s AND g.id_report = %s AND g.language = %s",['Robot','Robot_user','Robot_user',str(report.id_report),str(report.language)])
        # ans = cursor.fetchall()
        # gt_robot = len(ans)
        # print('robot',str(gt_robot))
        # print('human',str(gt_human))
        rep = report.report_json

        # print('totale:',str(total))
        topic = TopicHasDocument.objects.filter(id_report = report,language = report.language).values('name')
        for top in topic:
            new_rep = {}
            for key in rep.keys():
                nkey = key + '_0'
                new_rep[nkey] = rep[key]
            cursor = connection.cursor()
            cursor.execute(
                "SELECT * FROM ground_truth_log_file AS g INNER JOIN topic_has_document AS t ON t.id_report = g.id_report AND g.language = t.language WHERE t.id_report = %s AND t.language = %s AND t.name = %s",[str(el.id_report),str(el.language),str(top['name'])])
            human = cursor.fetchall()
            total = len(human)
            new_rep['topic'] = top['name']
            new_rep['id_report'] = report.id_report
            new_rep['institute'] = report.institute
            new_rep['language'] = report.language
            new_rep['batch'] = report.batch
            json_resp['reports'].append({'total':total, 'report':new_rep,'id_report':el.id_report, 'language':el.language})
        # print('elaboro1',str(end1-st1))
    # tot = time.time()
    # print('totale',str(tot-st))

    return JsonResponse(json_resp,safe=False)
#-----------------------------------------------------------------------------------------------------------

# def report_missing_auto(request):
#
#     """Check the number of reports annotated by the machine. It is needed by frontend to display how many reports
#     have not been alg annotated yet if one or more reports have been inserted later.
#
#     .js files: UpdateConfiguration.js"""
#
#     usecases = UseCase.objects.all()
#     json_resp = {}
#
#     for el in usecases:
#         use = el.name
#         batches = []
#         batches.append('all')
#         if use.lower() in ['colon','lung','uterine cervix']:
#             cursor = connection.cursor()
#             cursor.execute(
#                 "SELECT r.batch FROM report AS r INNER JOIN topic_has_document AS t ON t.language = r.language AND r.id_report = t.id_report WHERE t.name = %s AND r.language = %s AND r.institute != %s",
#                 [str(el),'english', 'PUBMED'])
#             reports = cursor.fetchall()
#             #report = Report.objects.filter(name=el,language='english').exclude(institute = 'PUBMED')
#             count_rep = len(reports)
#             for rp in reports:
#                 if rp[0] not in batches:
#                     batches.append(rp[0])
#             # print(el)
#             # print(count_rep)
#             if count_rep > 0:
#                 json_resp[use] = {}
#                 for batch in batches:
#                     batch = str(batch)
#                     json_resp[use][batch] = {}
#                     if batch == 'all':
#                         json_resp[use][batch]['tot'] = count_rep
#                         with connection.cursor() as cursor:
#                             cursor.execute(
#                                 "SELECT COUNT(*) FROM report AS r INNER JOIN ground_truth_log_file AS g ON g.id_report = r.id_report AND r.language = g.language WHERE r.name = %s AND g.username = %s AND gt_type=%s and institute != %s and r.language =%s;",
#                                 [str(use),'Robot_user','labels','PUBMED','english']) # We could consider any of the gt_type
#                             groundTruths = cursor.fetchone()[0]
#                             if groundTruths is None:
#                                 json_resp[use][batch]['annotated'] = 0
#                             else:
#                                 json_resp[use][batch]['annotated'] = groundTruths
#                     else:
#                         cursor = connection.cursor()
#                         cursor.execute(
#                             "SELECT r.id_report FROM report AS r INNER JOIN topic_has_document AS t ON t.language = r.language AND r.id_report = t.id_report WHERE t.name = %s NAD r.institute != %s AND r.batch = %s",
#                             [str(el), 'PUBMED', batch])
#                         reports = cursor.fetchall()
#                         #report_count  = Report.objects.filter(name=el,batch = batch).exclude(institute = 'PUBMED').count()
#                         json_resp[use][batch]['tot'] = len(reports)
#                         with connection.cursor() as cursor:
#                             cursor.execute(
#                                 "SELECT COUNT(*) FROM report AS r INNER JOIN ground_truth_log_file AS g ON g.id_report = r.id_report AND r.language = g.language WHERE r.name = %s AND g.username = %s AND gt_type=%s and institute != %s and batch = %s and r.language = %s;",
#                                 [str(use), 'Robot_user', 'labels', 'PUBMED',batch,'english'])  # We could consider any of the gt_type
#                             groundTruths = cursor.fetchone()[0]
#                             if groundTruths is None:
#                                 json_resp[use][batch]['annotated'] = 0
#                             else:
#                                 json_resp[use][batch]['annotated'] = groundTruths
#     # print(json_resp)
#     return JsonResponse(json_resp)
#
#
# def pubmed_missing_auto(request):
#
#     """Check the number of reports annotated by the machine. It is needed by frontend to display how many reports
#     have not been alg annotated yet if one or more reports have been inserted later.
#
#     .js files: UpdateConfiguration.js"""
#
#     usecases = UseCase.objects.all()
#     json_resp = {}
#     json_resp['annotated'] = 0
#     json_resp['tot'] = 0
#     json_resp['usecase'] = []
#     for el in usecases:
#         use = el.name
#         json_resp[use] = {}
#         batches = []
#         batches.append('all')
#         if use.lower() in ['colon','lung','uterine cervix']:
#             cursor = connection.cursor()
#             cursor.execute(
#                 "SELECT r.id_report FROM report AS r INNER JOIN topic_has_document AS t ON t.language = r.language AND r.id_report = t.id_report WHERE t.name = %s AND r.language = %s AND r.institute = %s",
#                 [str(el),'english', 'PUBMED'])
#             report = cursor.fetchall()
#             #report = Report.objects.filter(name=el,language='english',institute = 'PUBMED')
#             for rep in report:
#                 el = Report.objects.get(id_report = rep[0],language = 'english')
#                 if el.batch not in batches:
#                     batches.append(el.batch)
#             count_rep = report.count()
#
#             if count_rep > 0:
#                 json_resp['usecase'].append(str(use))
#                 json_resp['tot'] = json_resp['tot'] + count_rep
#                 with connection.cursor() as cursor:
#                     cursor.execute(
#                         "SELECT COUNT(*) FROM report AS r INNER JOIN ground_truth_log_file AS g ON g.id_report = r.id_report AND r.language = g.language WHERE r.name = %s AND g.username = %s AND gt_type=%s AND institute = %s and r.language = %s;",
#                         [str(use),'Robot_user','labels','PUBMED','english']) # We could consider any of the gt_type
#                     groundTruths = cursor.fetchone()[0]
#
#                     json_resp['annotated'] = json_resp['annotated'] + groundTruths
#
#                 for batch in batches:
#
#                     json_resp[use][batch] = {}
#                     if batch == 'all' or batch is None:
#                         cursor = connection.cursor()
#                         cursor.execute("SELECT * FROM report AS r INNER JOIN topic_has_document AS t ON t.language = r.language AND r.id_report = t.id_report WHERE t.name = %s AND r.institute != %s",
#                                        [str(el),'PUBMED'])
#                         report = cursor.fetchall()
#                         count_rep = len(report)
#                         # report = Report.objects.filter(name=use, institute='PUBMED')
#                         # count_rep = report.count()
#                         json_resp[use][batch]['tot'] = count_rep
#                         with connection.cursor() as cursor:
#                             cursor.execute(
#                                 "SELECT COUNT(*) FROM report AS r INNER JOIN ground_truth_log_file AS g ON g.id_report = r.id_report AND r.language = g.language WHERE r.name = %s AND g.username = %s AND gt_type=%s AND institute = %s and r.language = %s;",
#                                 [str(use),'Robot_user','labels','PUBMED','english']) # We could consider any of the gt_type
#                             groundTruths = cursor.fetchone()[0]
#
#                             if groundTruths is None:
#                                 json_resp[use][batch]['annotated'] = 0
#                             else:
#                                 json_resp[use][batch]['annotated'] = groundTruths
#                     else:
#                         cursor = connection.cursor()
#                         cursor.execute("SELECT * FROM report AS r INNER JOIN topic_has_document AS t ON t.language = r.language AND r.id_report = t.id_report WHERE t.name = %s and r.language = %s AND r.institute = %s AND r.batch = %s",
#                                        [str(el),'english','PUBMED',batch])
#                         report = cursor.fetchall()
#                         #report = Report.objects.filter(name=use,language='english', institute='PUBMED',batch = batch)
#                         count_rep = len(report)
#                         json_resp[use][batch]['tot'] = count_rep
#                         with connection.cursor() as cursor:
#                             cursor.execute(
#                                 "SELECT COUNT(*) FROM report AS r INNER JOIN ground_truth_log_file AS g ON g.id_report = r.id_report AND r.language = g.language WHERE r.name = %s AND g.username = %s AND gt_type=%s AND institute = %s and batch = %s and r.language = %s;",
#                                 [str(use), 'Robot_user', 'labels', 'PUBMED',batch,'english'])  # We could consider any of the gt_type
#                             groundTruths = cursor.fetchone()[0]
#
#                             if groundTruths is None:
#                                 json_resp[use][batch]['annotated'] = 0
#                             else:
#                                 json_resp[use][batch]['annotated'] = groundTruths
#     # print('risposta',json_resp)
#     return JsonResponse(json_resp)


# def get_post_fields_for_auto(request):
#
#     """GET request: get the fields to automatically extract annotations from.
#     POST request: post the fields to automatically extract annotations from.
#
#     .js files: UpdateConfiguration.js SubmitButtons.js DownloadGT.js OptionsModal.js StartingMeny.js MyStats.js"""
#
#     workpath = os.path.dirname(os.path.abspath(__file__))  # Returns the Path your .py file is in
#     with open(os.path.join(workpath, './automatic_annotation/auto_fields/auto_fields.json'), 'r') as use_outfile:
#         json_to_ret = json.load(use_outfile)
#     if request.method == 'GET':
#         return JsonResponse(json_to_ret)
#
#     if request.method == 'POST':
#         json_error = {'error': 'an error occurred'}
#         json_resp = {'msg': 'ok'}
#         try:
#             request_body_json = json.loads(request.body)
#             fields = request_body_json['fields']
#
#             for k in fields.keys():
#                 array_use = fields[k]
#                 prev_arr = json_to_ret['extract_fields'][k]
#                 for el in array_use:
#                     if el not in json_to_ret['extract_fields'][k]:
#                         prev_arr.append(el)
#                 json_to_ret['extract_fields'][k] = prev_arr
#             # print(json_to_ret)
#             with open(os.path.join(workpath, './automatic_annotation/auto_fields/auto_fields.json'), 'w') as use_outfile:
#                 json.dump(json_to_ret,use_outfile)
#             return JsonResponse(json_resp)
#         except Exception as e:
#             print(e)
#             return JsonResponse(json_error)



def annotation_all_stats(request):

    """It returns the statistics of all the annotations, depending on Automatic or Manual annotation mode.

    .js files: TableToShow.js  """

    id_report = request.GET.get('report',None)
    language = request.GET.get('language',None)
    topic = request.GET.get('topic',None)

    json_dict = get_annotations_count(id_report,language,topic)

    #print('annotations',json_dict)
    return JsonResponse(json_dict)


def delete_reports(request):

    """This view removes one or more entries from the reports table

        .js files: TableToShow.js"""

    request_body_json = json.loads(request.body)
    report_list = request_body_json['report_list']
    # print(type(report_list))
    try:
        with transaction.atomic():
            json_resp = {'msg':'ok'}
            for report in report_list:
                # print(report)
                #rp = Report.objects.filter(id_report = report['id_report'],language = report['language'])
                use = UseCase.objects.get(name = report['topic'])
                rep = Report.objects.get(id_report = report['id_report'],language = report['language'])
                rp = TopicHasDocument.objects.filter(id_report = rep,language = report['language'],name = use)
                if rp.count() == 1:
                    rp = rp.first()
                    Annotate.objects.filter(id_report = rep,language=rep.language,name = use).delete()
                    Linked.objects.filter(id_report = rep,language=rep.language,topic_name = use).delete()
                    # Mention.objects.filter(id_report = rep,language=rep.language,name = use).delete()
                    Associate.objects.filter(id_report = rp,language=rp.language,name = use).delete()
                    Contains.objects.filter(id_report = rp,language=rp.language,topic_name = use).delete()
                    GroundTruthLogFile.objects.filter(id_report = rp,language=rp.language,name = use).delete()
                    rp.delete()
                    if TopicHasDocument.objects.filter(id_report = report['id_report'],language = report['language']).count() == 0:
                        Report.objects.filter(id_report = report['id_report'],language = report['language']).delete()
            # print('DONE')
            return JsonResponse(json_resp)

    except Exception as e:
        json_error={'error':e}
        return JsonResponse(json_error)


def get_gt_action_based(request):

    """This view returns the number of ground truths for the required action.

    .js files: DownloadForModal.js"""

    action = request.GET.get('action',None)
    ns = request.GET.get('annotation_mode',None)

    if ns == 'Manual':
        ns = 'Human'
    elif ns == 'Automatic':
        ns = 'Robot'
    gts = GroundTruthLogFile.objects.filter(gt_type=action)

    if ns is not None:
        ns_id = NameSpace.objects.get(ns_id = ns)
        gts = GroundTruthLogFile.objects.filter(ns_id = ns_id, gt_type = action)

    json_resp = {'count':gts.count()}
    return JsonResponse(json_resp)


def get_insertion_time_record(request):

    """This view returns the insertion time of the ground truth of a specific report and action

    .js files: ReportListUpdated.js"""

    report = request.GET.get('rep',None)
    language = request.GET.get('language',None)
    user_obj = request.GET.get('username',request.session['username'])
    ns_id_str = request.GET.get('ns_id',None)
    action = request.GET.get('action',None)
    # topic = request.GET.get('topic',None)
    topic = UseCase.objects.get(name = request.session['usecase'])
    report1 = Report.objects.get(id_report = report, language = language)
    ns_id = NameSpace.objects.get(ns_id=ns_id_str)
    # print('get_insertion_time')
    user = User.objects.get(username=user_obj,ns_id=ns_id)
    gt_user = GroundTruthLogFile.objects.filter(name = topic,id_report = report1, language = language, ns_id = ns_id,username=user,gt_type=action)
    if gt_user.exists():
        gt_user = GroundTruthLogFile.objects.get(name = topic,id_report = report1, language = language, ns_id = ns_id,username=user,gt_type=action)
        val = (gt_user.insertion_time.replace(tzinfo=timezone.utc).astimezone(tz=None))
        if user_obj == request.session['username'] and ns_id_str == 'Robot':
            ns_id_rob = NameSpace.objects.get(ns_id='Robot')
            user_rob = User.objects.get(username='Robot_user', ns_id=ns_id_rob)
            gt_rob = GroundTruthLogFile.objects.get(name = topic,id_report = report1, language = language, ns_id = ns_id,username=user_rob,gt_type=action)
            if gt_user.insertion_time != gt_rob.insertion_time:
                val = (gt_user.insertion_time.replace(tzinfo=timezone.utc).astimezone(tz=None))

                json_resp = {'date':val}
            else:
                json_resp = {'date': ''}
        else:
            json_resp = {'date': val}
    else:
        json_resp = {'date': ''}
    return JsonResponse(json_resp)


def get_users_list(request):

    """This view returns the list of users"""

    users = User.objects.all().values('username')
    user_black_list = ['Robot_user']
    lista = []
    for name in users:
        if name['username'] not in user_black_list and name['username'] not in lista:
            lista.append(name['username'])
    return JsonResponse(lista,safe=False)


def get_user_ground_truth(request):

    """This view returns the ground-truth associated to a specific user,action,report"""

    user = request.GET.get('user',None)
    action = request.GET.get('action',None)
    mode = request.GET.get('mode',None)
    report = request.GET.get('report',None)
    topic = request.GET.get('topic',None)
    language = request.GET.get('language',request.session['language'])
    mode_obj = NameSpace.objects.get(ns_id=mode)
    report = Report.objects.get(id_report = report, language = language)
    topic = UseCase.objects.get(name = topic)
    gt = get_user_gt(user,mode_obj,report,language,action,topic)
    return JsonResponse(gt)


# def check_auto_presence_for_configuration(request):
#
#     """This view returns the number of reports automatically annotated by the algorithm, needed when a set has not been annotated yet
#     .js files: OptionsModal.js StartingMenu.js ChangeMemberGT.js"""
#
#     report_type = request.GET.get('report_type',None)
#     usecase = request.GET.get('usecase',None)
#     language = request.GET.get('language',None)
#     institute = request.GET.get('institute',None)
#     batch = request.GET.get('batch',None)
#     print('BATCH',str(batch))
#     use = UseCase.objects.get(name=usecase)
#     json_resp = {}
#     mode = NameSpace.objects.get(ns_id = 'Robot')
#     user = User.objects.get(ns_id = mode, username='Robot_user')
#
#     if report_type == 'pubmed':
#         cursor = connection.cursor()
#         cursor.execute("SELECT COUNT(*) FROM ground_truth_log_file AS g INNER JOIN report AS r ON r.id_report = g.id_report AND r.language = g.language WHERE g.ns_id = %s AND g.username = %s AND r.institute=%s AND r.language = %s AND r.name = %s AND r.batch = %s",['Robot','Robot_user','PUBMED','english',str(usecase),int(batch)])
#         reports = cursor.fetchone()[0]
#         json_resp['count'] = reports
#
#     elif report_type == 'reports':
#         cursor = connection.cursor()
#         cursor.execute(
#             "SELECT COUNT(*) FROM ground_truth_log_file AS g INNER JOIN report AS r ON r.id_report = g.id_report AND r.language = g.language WHERE g.ns_id = %s AND g.username = %s AND r.institute!=%s AND r.institute = %s AND r.language = %s AND r.name = %s AND r.batch = %s",
#             ['Robot', 'Robot_user', 'PUBMED',str(institute),str(language),str(usecase),int(batch)])
#         reports = cursor.fetchone()[0]
#         json_resp['count'] = reports
#     # print(json_resp)
#     return JsonResponse(json_resp)


def get_batch_list(request):

    """This view returns the list of batches associated to a use case"""

    json_resp = {}
    usecase = request.GET.get('usecase')
    # print(usecase)
    use_obj = UseCase.objects.get(name=usecase)
    json_resp['batch_list'] = []
    cursor = connection.cursor()
    cursor.execute(
        "SELECT r.batch FROM report AS r INNER JOIN topic_has_document AS t ON t.id_report = r.id_report AND r.language = t.language WHERE r.institute != %s AND t.name = %s",
        [ 'PUBMED', str(usecase)])
    batch = cursor.fetchall()
    #batch = Report.objects.filter(name=use_obj).exclude(institute = 'PUBMED').values('batch')
    for el in batch:
        if el[0] not in json_resp['batch_list']:
            json_resp['batch_list'].append( el[0])
    # print(json_resp['batch_list'])
    json_resp['batch_list'] = sorted(json_resp['batch_list'])
    # print(json_resp)
    return JsonResponse(json_resp)


# def get_auto_anno_batch_list(request):
#
#     """This view returns the list of batches associated to a use case which have english language"""
#
#     json_resp = {}
#     usecase = request.GET.get('usecase')
#     print(usecase)
#     use_obj = UseCase.objects.get(name=usecase)
#     json_resp['batch_list'] = []
#     cursor = connection.cursor()
#     cursor.execute(
#         "SELECT r.batch FROM report AS r INNER JOIN topic_has_document AS t ON t.id_report = r.id_report AND r.language = t.language WHERE r.language = %s AND r.institute != %s AND t.name = %s",
#         ['english','PUBMED', str(usecase)])
#     batch = cursor.fetchall()
#     # batch = Report.objects.filter(name=use_obj,language = 'english').exclude(institute = 'PUBMED').values('batch')
#     for el in batch:
#         if el[0] not in json_resp['batch_list']:
#             json_resp['batch_list'].append( el[0])
#     print(json_resp['batch_list'])
#     json_resp['batch_list'] = sorted(json_resp['batch_list'])
#     print(json_resp)
#     return JsonResponse(json_resp)


def get_PUBMED_batch_list(request):

    """This view returns the list of batches associated to a PUBMED use case"""

    json_resp = {}
    usecase = request.GET.get('usecase')
    print(usecase)
    use_obj = UseCase.objects.get(name=usecase)
    json_resp['batch_list'] = []
    cursor = connection.cursor()
    cursor.execute(
        "SELECT r.batch FROM report AS r INNER JOIN topic_has_document AS t ON t.id_report = r.id_report AND r.language = t.language WHERE r.institute != %s AND t.name = %s",
        ['PUBMED', str(usecase)])
    batch = cursor.fetchall()
    #batch = Report.objects.filter(name=use_obj,institute = 'PUBMED').values('batch')
    for el in batch:
        if el[0] not in json_resp['batch_list']:
            json_resp['batch_list'].append( el[0])
    # print(json_resp['batch_list'])
    json_resp['batch_list'] = sorted(json_resp['batch_list'])
    # print(json_resp)
    return JsonResponse(json_resp)


# def get_auto_anno_PUBMED_batch_list(request):
#
#     """This view returns the list of batches associated to a PUBMED use case in english language """
#
#     json_resp = {}
#     usecase = request.GET.get('usecase')
#     print(usecase)
#     use_obj = UseCase.objects.get(name=usecase)
#     json_resp['batch_list'] = []
#     cursor = connection.cursor()
#     cursor.execute("SELECT r.batch FROM report AS r INNER JOIN topic_has_document AS t ON t.id_report = r.id_report AND r.language = t.language WHERE r.language = %s AND r.institute = %s AND t.name = %s",
#                    ['english','PUBMED',str(usecase)])
#     batch = cursor.fetchall()
#     # batch = Report.objects.filter(name=use_obj,language = 'english',institute = 'PUBMED').values('batch')
#     for el in batch:
#         if el[0] not in json_resp['batch_list']:
#             json_resp['batch_list'].append( el[0])
#     print(json_resp['batch_list'])
#     json_resp['batch_list'] = sorted(json_resp['batch_list'])
#     print(json_resp)
#     return JsonResponse(json_resp)


# def get_presence_robot_user(request):
#
#     """This view returns whether the automatic annotations are available given an id,language,usecase
#     .js files: MajorityVoteModal.js DownloadModalRep.js"""
#
#     id_report = request.GET.get('id_report',None)
#     language = request.GET.get('language',None)
#     use = request.GET.get('usecase',None)
#     rep = request.GET.get('report_type',None)
#     json_resp = {'auto_annotation_count': 0}
#     cursor = connection.cursor()
#
#     reports_list = None
#     if request.method == 'POST':
#         request_body_json = json.loads(request.body)
#         reports_list = request_body_json['reports']
#
#     if id_report is not None and language is not None:
#
#         usecase = Report.objects.get(id_report = id_report,language = language)
#         use = usecase.name_id
#         cursor.execute(
#             "SELECT COUNT(*) FROM ground_truth_log_file as g INNER JOIN report AS r ON r.id_report = g.id_report AND r.language = g.language WHERE g.username = %s and r.name = %s",
#             ['Robot_user', str(use)])
#         ans = cursor.fetchone()[0]
#         json_resp = {'auto_annotation_count': (ans)}
#
#     elif use is not None and rep is not None:
#         # print(rep)
#         if rep == 'reports':
#             cursor.execute(
#                 "SELECT COUNT(*) FROM ground_truth_log_file as g INNER JOIN report AS r ON r.id_report = g.id_report AND r.language = g.language WHERE g.username = %s and r.name = %s and r.institute != %s",
#                 ['Robot_user', str(use), 'PUBMED'])
#
#         elif rep == 'pubmed':
#             cursor.execute("SELECT COUNT(*) FROM ground_truth_log_file as g INNER JOIN report AS r ON r.id_report = g.id_report AND r.language = g.language WHERE g.username = %s and r.name = %s and r.institute = %s",['Robot_user',str(use),'PUBMED'])
#
#         ans = cursor.fetchone()[0]
#         if ans > 0:
#
#             json_resp = {'auto_annotation_count':ans}
#         # print(json_resp)
#     elif reports_list is not None:
#         report_list = json.loads(reports_list)
#         # print(report_list)
#         usecase_list = []
#         for rep in report_list:
#
#             if rep['usecase'] not in usecase_list:
#                 usecase_list.append(rep['usecase'])
#         for u in usecase_list:
#             cursor = connection.cursor()
#             cursor.execute(
#                 "SELECT COUNT(*) FROM ground_truth_log_file as g INNER JOIN report AS r ON r.id_report = g.id_report AND r.language = g.language WHERE g.username = %s and r.name = %s",
#                 ['Robot_user', str(u)])
#             ans = cursor.fetchone()[0]
#             if ans > 0:
#                 json_resp = {'auto_annotation_count': ans}
#             else:
#                 json_resp = {'auto_annotation_count': 0}
#
#     elif use is None and reports_list is None and id_report is None and language is None:
#         robot = NameSpace.objects.get(ns_id = 'Robot')
#         gt = GroundTruthLogFile.objects.filter(ns_id = robot)
#         json_resp = {'auto_annotation_count': gt.count()}
#
#     print(json_resp)
#     return JsonResponse(json_resp)


# def check_presence_exa_conc_lab(request):
#
#     """This view returns true if for a usecase there are only examode labels and concepts
#     .js files: ReportsForModal.js DownloadModalRep.js MajorityVoteModal.js """
#
#     # reports = request.GET.get('reports',None)
#     rep = request.GET.get('id_report',None)
#     language = request.GET.get('language',None)
#     usecase = request.GET.get('usecase',None)
#     reports = None
#     if request.method == 'POST':
#         request_body_json = json.loads(request.body)
#         reports = request_body_json['reports']
#     if rep is not None and language is not None:
#         report = Report.objects.get(id_report = rep,language = language)
#         usecase = report.name_id
#         # print(usecase)
#         json_resp = {}
#         if usecase in ['colon','uterine cervix','lung']:
#             bool = check_exa_lab_conc_only(usecase)
#             print('bool',bool)
#         else:
#             bool = [False,False]
#         json_resp['labels'] = bool[0]
#         json_resp['concepts'] = bool[1]
#     elif usecase is not None:
#         json_resp = {}
#         json_resp['labels'] = False
#         json_resp['concepts'] = False
#
#         # labels = []
#         # concepts = []
#         json_resp = {}
#         if usecase in ['colon','uterine cervix','lung']:
#             bool = check_exa_lab_conc_only(usecase)
#         else:
#             bool = [False,False]
#         json_resp['labels'] = bool[0]
#         json_resp['concepts'] = bool[1]
#         # labels.append(bool[0])
#         # concepts.append(bool[1])
#         # if False in labels:
#         #     json_resp['labels'] = False
#         # else:
#         #     json_resp['labels'] = True
#         #
#         # if False in concepts:
#         #     json_resp['concepts'] = False
#         # else:
#         #     json_resp['concepts'] = True
#     elif reports is not None:
#         report_list = json.loads(reports)
#         json_resp = {}
#         json_resp['labels'] = False
#         json_resp['concepts'] = False
#         usecases = []
#         for rep in report_list:
#             # rep = json.loads(rep)
#             if rep['usecase'] not in usecases:
#                 usecases.append(rep['usecase'])
#         labels = []
#         concepts = []
#         for u in usecases:
#             # print(u)
#             json_resp = {}
#             if u in ['colon', 'uterine cervix', 'lung']:
#                 bool = check_exa_lab_conc_only(u)
#             else:
#                 bool = [False, False]
#
#             labels.append(bool[0])
#             concepts.append(bool[1])
#         if False in labels:
#             json_resp['labels'] = False
#         else:
#             json_resp['labels'] = True
#
#         if False in concepts:
#             json_resp['concepts'] = False
#         else:
#             json_resp['concepts'] = True
#
#     else:
#         json_resp={'error':'a usecase is needed'}
#
#     print(json_resp)
#     return JsonResponse(json_resp)


def create_majority_vote_groundtruth(request):
    request_body_json = json.loads(request.body)
    id_report = request_body_json['id_report']
    language = request_body_json['language']
    mode = request_body_json['mode']
    action = request_body_json['action']
    users = request_body_json['users']
    topic = request_body_json['topic']
    topic = UseCase.objects.get(name = topic)
    report = Report.objects.get(id_report = id_report,language = language)

    json_resp = create_majority_vote_gt(action, users, mode, report, topic)
    # print(json_resp)
    return JsonResponse(json_resp)


from DocTAG_App.utils_majority_vote import *
def download_all_reports(request):
    """This view handles the download of one or more reports' groundtruths (including the GT majority vote based.

        .js files: DownloadForModal.js"""

    request_body_json = json.loads(request.body)
    report_list = request_body_json['report_list']
    mode = request_body_json['format']
    action = request_body_json['action']
    annot = request_body_json['annotation_mode']
    topic = request_body_json['topic']

    if annot == 'Manual':
        annot = 'Human'
    elif annot == 'Automatic':
        annot = 'Robot'

    try:
        response = HttpResponse(content_type='text/csv')
        resp = download_report_gt(report_list, action, annot, mode, response,topic)
        if mode == 'biocxml' or mode == 'biocjson':
            return HttpResponse(resp, content_type='application/xml')
        elif mode == 'csv':
            return resp
        elif mode == 'json':
            return JsonResponse(resp)

    except Exception as e:
        print(e)
        json_error = {'error': e}
        return JsonResponse(json_error)


def download_majority_reports(request):
    request_body_json = json.loads(request.body)

    format = request_body_json['format']
    report_list = request_body_json['reports']
    action = request_body_json['action']
    mode = request_body_json['annotation_mode']
    chosen_users = request_body_json['chosen_users']
    topic = request_body_json['topic']
    try:
        response = HttpResponse(content_type='text/csv')
        resp = download_majority_gt(chosen_users,report_list, action, mode, format,response,topic)
        if format == 'biocxml' or format == 'biocjson':
            return HttpResponse(resp, content_type='application/xml')
        elif format == 'csv':
            return resp
        elif format == 'json':
            return JsonResponse(resp)

    except Exception as e:
        print(e)
        json_error = {'error': e}
        return JsonResponse(json_error)


def update_user_chosen(request):

    """This view updates the team member: this is needed to see the ground truth of a specific user"""

    request_body_json = json.loads(request.body)
    user = request_body_json['user_chosen']
    if user is not None:
        request.session['team_member'] = user
        json_resp = {'msg':'ok'}
        return JsonResponse(json_resp)
    else:
        json_resp={'msg':'a user is required '}
        return JsonResponse(json_resp,status=500)


def check_PUBMED_reports(request):

    """This view returns the number of pubmed articles in the db"""

    json_resp = {}
    json_resp['count'] = 0
    pubmed_arts = Report.objects.filter(institute = 'PUBMED')
    for el in pubmed_arts:
        if el.id_report.startswith('PUBMED'):
            json_resp['count'] += 1
    return JsonResponse(json_resp,safe=False)

def check_doctag_reports(request):

    """This view returns the number of doctag articles in the db"""

    json_resp = {}
    json_resp['count'] = 0
    doc = Report.objects.all().exclude(institute = 'PUBMED')
    json_resp['count'] = doc.count()

    # for el in pubmed_arts:
    #     if el.id_report.startswith('PUBMED'):
    #         json_resp['count'] += 1
    return JsonResponse(json_resp,safe=False)


# def get_uses_missing_exa(request):
#
#     """This view returns the usecases which have not nor exa labels nor exa concepts"""
#
#     use_to_ret = {}
#     use_to_ret['labels_present'] = []
#     use_to_ret['concepts_present'] = []
#     use_to_ret['labels_missing'] = []
#     use_to_ret['concepts_missing'] = []
#     uses = ['colon','uterine cervix','lung']
#     for el in uses:
#         usecase = UseCase.objects.get(name=el)
#         presence = False
#         cursor = connection.cursor()
#         cursor.execute("SELECT id_report FROM report AS r INNER JOIN topic_has_document AS t ON t.id_report = r.id_report AND r.language = t.language WHERE t.name = %s",
#                        [str(el)])
#         rep = cursor.fetchall()
#         # if Report.objects.filter(name = usecase).count() > 0:
#         if len(rep) > 0:
#             if not AnnotationLabel.objects.filter(name = usecase, annotation_mode = 'Manual and Automatic').exists():
#                 use_to_ret['labels_missing'].append(el)
#             else:
#                 use_to_ret['labels_present'].append(el)
#
#             cursor = connection.cursor()
#             cursor.execute("SELECT c.annotation_mode FROM concept AS c INNER JOIN concept_has_uc AS hc ON c.concept_url = hc.concept_url WHERE hc.name = %s",[str(el)])
#             ans = cursor.fetchall()
#             for concept in ans:
#                 if concept[0] == 'Manual and Automatic':
#                     presence = True
#                     break
#             if presence == False:
#                 use_to_ret['concepts_missing'].append(el)
#             else:
#                 use_to_ret['concepts_present'].append(el)
#     return JsonResponse(use_to_ret)


def handle_copy_rows(request):

    """This view handles the transfer of the ground truths from a user to another. COPY WHEN DATABASE IS SHARED

    .js files: UpdateFle.js"""

    request_body_json = json.loads(request.body)
    username = request_body_json['username']
    print(username)
    overwrite = request_body_json['overwrite']
    if overwrite == 'true':
        overwrite = True
    elif overwrite == 'false':
        overwrite = False

    usecases = UseCase.objects.all()
    uses = []
    json_resp = {'message':'Ok'}
    for el in usecases:
        if el.name not in uses:
            uses.append(el.name)
    if username is not None:
        try:
            for el in uses:
                copy_rows(el, username,request.session['username'],overwrite)

        except Exception as e:
            json_resp = {'error':'error'}
            return JsonResponse(json_resp,status=500)
        else:
            return JsonResponse(json_resp)


def handle_check_upload_files(request):

    """This view checks the files uploaded for the transfer of the ground-truths

    .js files: UpdateFle.js"""

    files = []
    for filename, file in request.FILES.items():
        files.append(file)

    json_message = check_uploaded_files(files)
    return JsonResponse(json_message)


def handle_upload_files(request):

    """This view adds in the database the data included in the files uploaded for the transfer of the ground-truths

    .js files: UpdateFle.js"""

    files = []
    for filename, file in request.FILES.items():
        files.append(file)
    overwrite = request.POST.get('overwrite',None)

    if overwrite == 'false':
        overwrite = False
    elif overwrite == 'true':
        overwrite = True

    json_message = upload_files(files,request.session['username'],overwrite)
    return JsonResponse(json_message)


def get_report_translations(request):

    """This view returns the languages available for a report"""

    languages = []
    json_resp = {}
    id_report = request.GET.get('id_report',None)
    if id_report is not None:
        languages = []
        lang = Report.objects.filter(id_report = id_report)
        for el in lang:
            if el.language not in languages:
                languages.append(el.language)

        json_resp = {}
        # print(languages)
    json_resp['languages'] = languages
    return JsonResponse(json_resp)


def get_number_of_annotations(request):

    """This view returns the number of annotations per topic and type"""

    json_resp = {}
    tot = 0
    anno = 0
    json_resp['tot'] = 0
    json_resp['annotations'] = 0
    try:
        topic = request.session['usecase']
        n = request.session['mode']
        ns = NameSpace.objects.get(ns_id = n)
        user = User.objects.get(username = request.session['username'],ns_id = ns)
        topic_obj = UseCase.objects.get(name = topic)
        type = request.GET.get('action',None)
        if type == 'false' or type == False:
            type = None
        # tot = 0
        tot = TopicHasDocument.objects.filter(name=topic_obj).count()

        if type == 'none':
            anno = 0
        if type is not None and type != 'none':
            anno = GroundTruthLogFile.objects.filter(name = topic_obj,username = user,gt_type = type).count()

        json_resp['tot'] = tot
        json_resp['annotations'] = anno
    except Exception as e:
        print(e)

    return JsonResponse(json_resp)

def get_topic_info(request):

    """This view returns the details associated to a specific topic"""

    topic = request.GET.get('topic',None)
    json_resp = {}
    json_resp['title'] = ''
    json_resp['description'] = ''
    json_resp['narrative'] = ''
    if topic is not None:
        to = UseCase.objects.get(name=topic)
        if to.title is not None:
            json_resp['title'] = to.title

        if to.description is not None:
            json_resp['description'] = to.description

        if to.narrative is not None:
            json_resp['narrative'] = to.narrative
    return JsonResponse(json_resp)


def get_query_doc_words(request):
        """
        This function provides a demonstration of the QueryDocMatcher module.

        After invoking this function, the top-k matching words between a toy query (topic) and document are computed.
        Finally, the list of top-k matching words sorted by tf-idf score is printed.

        """

        # topic = {
        #     "title": "Cities the First Lady visited on official business.",
        #     "description": "What cities other than Washington D.C. has the First Lady visited on official business (i.e., accompanying the President or addressing audiences/attending events)?"
        # }
        # top = request.GET.get('topic',None)
        id = request.GET.get('id_report',None)
        json_resp = {}
        workpath = os.path.dirname(os.path.abspath(__file__))  # Returns the Path your .py file is in
        with open(os.path.join(workpath, './config_files/tf_idf_map.json')) as out:
            data = json.load(out)
            top_words = data[str(request.session['usecase'])][str(id)]
            # for el in list_doc_words:
            #     if str((list(el.keys()))[0]) == str(id):
            #         top_words = list_doc_words[str(id)]
            #         break
        json_resp['top_k'] = top_words
        # Log the topic


        return JsonResponse(json_resp)

        # Log the top-k matching_words
        # IcLogger.print(top_k_matching_words)


