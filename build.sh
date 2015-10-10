
closure=~/apps/compiler/compiler.jar;
files=`find src -type f`;
fileout='starengine.min.js';
case $1 in
	'dev')
		cat `find src -type f` > $fileout;
		;;
	*)
		java -jar $closure --js $files --js_output_file $fileout;
		;;
esac


