#!/usr/bin/env python

import web

urls = (
    '/jst/(.*)', 'jst',
)

app = web.application(urls, globals())


class jst:
    def GET(self, templates):
        templates = templates.split(',')
        response = "window.JST = {};\n\n"

        for template in templates:
            template = template.replace("~", "/")
            path = 'templates/%s.html' % template
            content = open(path).read().replace('"', '\\"').replace("\n", "")
            content = """window.JST["%s"] = "%s";\n""" % (template, content)
            response += content

        web.header('Content-Type', 'application/javascript')
        return response


if __name__ == '__main__':
    app.run()
