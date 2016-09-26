from subprocess import call
filenames = []
with open('server/concat.conf') as f:
	for line in f:
		filenames.append("server/" + line.rstrip())

with open('server/nodeMin.js', 'w') as outfile:
	    for fname in filenames:
		            with open(fname) as infile:
				                for line in infile:
							                outfile.write(line)
call(["node", "server/nodeMin.js"]);
