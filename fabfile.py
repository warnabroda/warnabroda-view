from fabric.api import *
import cuisine
import os

project_path = "src/bi"

def deploy_view():
	with cd("warnabrodaview"):
		run("git pull")
		run("git submodule init")
		run("git submodule update")
		run("git submodule foreach git checkout master")
		run("npm install")
		run("bower install")
		run("grunt build")
		run("rm -rf /opt/warnabroda/project/view/dist_new")
		run("mv dist/ /opt/warnabroda/project/view/dist_new")
		run("rm -rf /opt/warnabroda/project/view/dist_old")
		run("mv /opt/warnabroda/project/view/dist /opt/warnabroda/project/view/dist_old")
		run("mv /opt/warnabroda/project/view/dist_new /opt/warnabroda/project/view/dist")


def undeploy_view():
    run("mv /opt/warnabroda/project/view/dist /opt/warnabroda/project/view/dist_new")
    run("mv /opt/warnabroda/project/view/dist_old /opt/warnabroda/project/view/dist")
