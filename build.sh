closure=~/apps/compiler/compiler.jar;
files=`find src -type f`;
java -jar $closure --js $files --js_output_file starengine.min.js;

