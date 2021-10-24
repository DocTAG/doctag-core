from django.http import HttpResponseRedirect


def my_login_required():
    def wrapper(request, *args, **kw):
        username = request.session.get('username',False)
        if not username:
            return HttpResponseRedirect('/login')
        return wrapper