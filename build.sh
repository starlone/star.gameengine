
closure=~/apps/compiler/compiler.jar;
files=`find src -type f | tac`;
fileout='starengine.min.js';
help_msg="
    Usage: ./build.sh [OPTION]\n
	    -> min - Minifier\n
	    -> dev - Developing build mode\n
	    -> server - Start web server\n
		-> help - Display this help\n
    Example:
	    ./build.sh min
"
function help(){
    echo -e $help_msg;
}

case $1 in
	'min')
		java -jar $closure --js $files --js_output_file $fileout;
		;;
	'dev')
		cat $files > $fileout;
		;;
	'server')
		python -m SimpleHTTPServer;
		;;
	'help')
		help;
		;;
	*)
		help;
		;;
esac


