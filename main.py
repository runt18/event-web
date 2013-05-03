#!/usr/bin/env python

builds = [
    ('plan', 'plan/main,header,footer,auth,plan/optional,plan/details,plan/times,plan/time,finishbutton,signup'),
    ('view', 'view/main,header,footer,auth,view/details,view/time,view/finishbox,finishbutton,signup,view/chat,view/attendee')
]


def build():
    for config in builds:
        name = config[0]
        templates = config[1].split(',')
        output = "window.JST = {};\n\n"

        for template in templates:
            if template:
                path = 'templates/%s.html' % template
                content = open(path).read().replace('"', '\\"').replace("\n", "")
                content = """window.JST["%s"] = "%s";\n""" % (template, content)
                output += content

        out = open('js/build/%s.js' % name, 'w')
        out.write(output)
        out.close()


if __name__ == '__main__':
    build()
