class ContentTypeMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        if response.status_code == 200:
            if request.path.endswith('.css'):
                response['Content-Type'] = 'text/css'
            elif request.path.endswith('.js'):
                response['Content-Type'] = 'application/javascript'
        return response
