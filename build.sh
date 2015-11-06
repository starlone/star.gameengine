
closure=~/apps/compiler/compiler.jar;
files=`find src -type f | tac`;
fileout='starengine.min.js';
case $1 in
	'dev')
		cat $files > $fileout;
		;;
	*)
		java -jar $closure --js $files --js_output_file $fileout;
		;;
esac


