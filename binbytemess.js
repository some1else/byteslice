const util = require("util")
const exec = util.promisify(require("child_process").exec)

async function main() {
	"./binrewrite.sh output/a.jpg.b.jpg.MAT-1.MAT.png 100 10 $(node binsniff.js 10)"
}

main()
