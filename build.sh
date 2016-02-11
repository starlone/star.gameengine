
closure=~/apps/compiler/compiler.jar;
files=`find src -type f | tac`;
fileout='starengine.min.js';
url='https://dl.google.com/closure-compiler/compiler-latest.zip'
help_msg="
    Usage: ./build.sh [OPTION]\n
	    -> bootstrap - Download Closure Compiler\n
	    -> min - Minifier\n
	    -> dev - Developing build mode\n
	    -> server - Start web server\n
	    -> devfg - Developing build mode and start web server\n
		-> help - Display this help\n
    Example:
	    ./build.sh min
"
function help(){
    echo -e $help_msg;
}

function concatfiles(){
	cat $files > $fileout;
}

case $1 in
	'bootstrap')
		mkdir -p ~/apps/compiler;
		cd ~/apps/compiler;
		wget $url;
		unzip compiler-latest.zip;
		rm compiler-latest.zip;
		;;
	'min')
		java -jar $closure --js $files --js_output_file $fileout;
		;;
	'dev')
		concatfiles;
		;;
	'server')
		python -m SimpleHTTPServer;
		;;
	'devfg')
		concatfiles;
		python -m SimpleHTTPServer;
		;;
	'help')
		help;
		;;
	*)
		help;
		;;
esac


