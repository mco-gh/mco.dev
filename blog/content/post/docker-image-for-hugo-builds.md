+++
date = "2015-08-31T18:56:39+02:00"
draft = false
title = "Docker image for Hugo builds (with Wercker)"
tags = ["Docker", "Hugo", "Wercker", "CI", "virtualization"]
+++

This blog is built with [Hugo](http://gohugo.io), which allows me to use some great CI tools like [Wercker](http://wercker.com). The first part of writing a *wercker.yml* is picking a build container.

A build container on Wercker is the environment in which your build or deploy steps run. Wercker used to build its own containers for that, but they've moved away from that approach to Docker containers. You can use all kinds of Docker containers, but most people just use one available publicly on [Docker Hub](https://registry.hub.docker.com/).

To deploy my website to [GitHub pages](https://pages.github.com/), all I need is Git. So that's why I built [this simple Docker container](https://hub.docker.com/r/samueldebruyn/debian-git/) with Debian and Git.

Building this blog requires some more packages. Wercker doesn't automatically pull in your Git submodules, so Git is also a necessity there. Another one is Hugo, to build the static website itself. Hugo doesn't minimize your files, however. That's why I also include [YUI compressor](https://github.com/yui/yuicompressor) (minifies *.js and *.css) and [HTML minifier](https://github.com/kangax/html-minifier) (like the name says, minifies HTML files). Finally, I've been experimenting with [HTML proofer](https://github.com/gjtorikian/html-proofer) to validate the generated HTML files and check them for dead links. All of these packages (and their dependencies) are available in my Docker container called [hugo-build](https://hub.docker.com/r/samueldebruyn/hugo-build/).

## Side notes

### hugo-build

The image is quite big. It needs Java for YUI compressor, Ruby for html-proofer and Node for html-minifier. Setting up the environment and storing the container each take about half a minute. If you have some suggestions on making the image smaller, please [submit an issue or a pull request](https://github.com/SamuelDebruyn/docker-hugo-build).

The latest list of included packages is available in the [README file](https://github.com/SamuelDebruyn/docker-hugo-build).

The build often fails on a time-out while running `apt-get`. It's usually *fixed* by running another build.

### html-proofer

html-proofer will often fail because it scans your website for dead links before your website is even published. I haven't been able to work around this, but [here's an issue](https://github.com/gjtorikian/html-proofer/pull/178) that's keeping track of this.

### Example *wercker.yml* using these images

My blog uses these images to build and deploy automatically through Wercker. The source code is [publicly available](https://github.com/SamuelDebruyn/chipsncookies-site) on GitHub.