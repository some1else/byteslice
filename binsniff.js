const amountOption = process.argv[2]

const amount = amountOption.length > 0 ? parseInt(amountOption) : 1

const buffer = Buffer.allocUnsafe(amount)

process.stdout.write(buffer)
