import sha256 from "sha256"

const objHippoChain = {
    chain: [
        // genesis block
        {
            index:0,
            time:Date.now(),
            transaction:{},
            nonce:0,
            hash:"thishash",
            previousHash:"thisprevhash"
        }
    ],
    getLastBLock: () => {
        return objHippoChain.chain[objHippoChain.chain.length - 1]
    },
    generateHash: (strPreviousHash,datStartTime,objNewTransaction) => {
        let strLocalHash = ''
        let intNonce = 0

        while(strLocalHash.substring(0,4) != 'this'){
            intNonce ++

            strLocalHash = sha256(`${strPreviousHash}${datStartTime}${objNewTransaction}${intNonce}`)
        }
        return {strLocalHash,intNonce}
    },
    createNewBlock: (decTransAmt,strTransSender,strTransRecipient) => {
        const objNewTransaction = {decTransAmt,strTransSender,strTransRecipient}
        const datInitTime = Date.now()
        const prevBlock = objHippoChain.getLastBLock()
        const newCoinHash = objHippoChain.generateHash(prevBlock.hash,datInitTime,objNewTransaction)

        const newBlock = {
            index:prevBlock.index +1,
            time:datInitTime,
            transaction:objNewTransaction,
            nonce:newCoinHash.intNonce,
            hash:newCoinHash.strLocalHash,
            previousHash:prevBlock.hash
        }
        objHippoChain.chain.push(newBlock)
    },
    printChain: () => {
        console.log(objHippoChain.chain)
    }
}

export {objHippoChain};