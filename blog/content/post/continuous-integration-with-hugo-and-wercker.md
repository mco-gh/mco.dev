+++
date = "2015-07-14T12:45:28+02:00"
title = "Continuous integration with Hugo and Wercker"
tags = ["CI", "Hugo", "wercker"]
+++

## Why?

Who doesn't love [GitHub Pages](https://pages.github.com/)? It's the easiest way to create a simple website about a repository and you can even use [Jekyll](http://jekyllrb.com/) to start blogging.

As I recently switched from Jekyll to [Hugo](http://gohugo.io), I needed a new way to enable continuous integration for my blog.

## New to CI?

Continuous integration, or CI, means that your code is automatically built, tested and/or deployed after each push. Every time you push some commits to a remote repository, the code in that repository is being built.

I usually have a branch called *develop* to which I push fresh code. Then a CI tool checks if that code builds properly and if it does, I merge it to my *master* branch. It's a lot like [Git Flow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow).

## What about Hugo and GitHub Pages?

You could setup a CI tool to build your code after every push on every branch and deploy it to GitHub Pages after a successful build on your stable/*master* branch.

## In comes Wercker

I used to use [Travis](http://travis-ci.org) for all my CI needs, but then I came across [Wercker](http://wercker.com) in the [Hugo docs](http://gohugo.io/tutorials/automated-deployments/).

Wercker simplifies CI a lot and relies on [Docker](http://docker.com) for its build environments. It also allows you to deploy your builds to different environments (e.g. production, staging, testing...) Hugo has a guide about how to set it up, but it's a little bit outdated. I might just send a pull request with an update in a few days. Wercker also has a lot of documentation. So with the examples below, you should be able to easily walk through the setup.

### Setting it up

1. Create a new Wercker app based on the repository containing your Hugo source code and give Wercker access rights. You can leave everything else on the default settings. If you'd like a badge showing your build status, make sure your app is public.
1. Next, edit your app settings and create a custom deploy target including a protected environment variable called `GIT_TOKEN`.
1. Finally, add a file called *wercker.yml* to your repository with the code below. Change it to fit your needs.

		box: debian
		build:
		  steps:
		    - script:
		        name: install git
		        code: |
		          apt-get update && apt-get install git -y
		    - script:
		        name: initialize git submodules
		        code: |
		            git submodule update --init --recursive
		    - arjen/hugo-build:
		        version: "0.14"
		        theme: crisp
		deploy:
		  steps:
		    - script:
		        name: install git
		        code: |
		          apt-get update && apt-get install git -y
		    - leipert/git-push:
		        gh_oauth: $GIT_TOKEN
		        basedir: public
		        clean_removed_files: true
		        branch: master
		        repo: SamuelDebruyn/samueldebruyn.github.io
		        gh_pages_domain: chipsncookies.com

	Obviously, you have to change the following variables:
	
	* `version`: the Hugo version you use
	* `theme`: the theme you use
	* `branch`: the branch on GitHub Pages you wish to publish on (should be `master` for personal/organization pages and `gh-pages` for project pages)
	* `repo`: the repository you wish to publish your pages in (should be `username/username.github.io` for personal/organization pages and `username/project-repo` for project pages)
	* `gh_pages_domain`: a custom CNAME (optional, [read more](https://help.github.com/articles/setting-up-a-custom-domain-with-github-pages/))
	
	Push a commit with that file and Wercker should happily start building and deploying your code!

### A few examples

* the Hugo source code for this blog: https://github.com/SamuelDebruyn/chipsncookies-site
* the wercker app for this blog: https://app.wercker.com/#applications/5586dcbdaf7de9c51b02b0d5
* the generated source code for this blog: https://github.com/SamuelDebruyn/samueldebruyn.github.io