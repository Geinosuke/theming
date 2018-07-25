'use strict';
// Npm depedencies
const {cleanData, getGramm, getJaccard, getTFIDF, splitStringInput} = require('themingjs');
const is = require('@sindresorhus/is');
const { countBy } = require('lodash');

module.exports = function(Theme) {
     // Detect theme input text. Should be http - get
    Theme.whichTheme = async function (input) {
        let { text } = input
        const themes = await Theme.find();
        let res = [];
        themes.forEach(theme => {
            let currTheme = {
                theme: theme.title
            };
            for (let i = 0; i < 3; i++){
                const testInput = countBy(getGramm(i + 1, cleanData(splitStringInput(text), true)));
                theme.data.forEach(item => {
                    if(item.kgramm === i + 1){
                        Reflect.set(currTheme, `gramm${i+1}`, getJaccard(testInput, item.corpus));
                    }
                });
            }
            res.push(currTheme);
        });
        return res;
    }
    Theme.remoteMethod('whichTheme', {
        accepts: {arg: 'input', type: 'object', http: { source: 'body' }},
        returns: {arg: 'res', type: 'array', root: true}
    });

    function getJaccard(first, second){
        const total = Object.entries(first).length + Object.entries(second).length;
        let common = getCommon(first, second);
        return common/total;
    }

    function getCommon(first, second){
        let count = 0;
        for (let key1 in first){
            for (let key2 in second){
                if (key1 === key2){
                    count++;
                }
            }
        }
        return count;
    }
  
   // Generate kgramms and tfidf for all theme then for selected theme
    Theme.generateTFIDF = async function (){
        const themes = await Theme.find();
        const promises = themes.map(theme => theme.generateTFIDF());
        await Promise.all(promises);
        return {
            status: "ok"
        }
    }
    Theme.remoteMethod('generateTFIDF', {
        accepts: [],
        returns: {arg: 'res', type: 'object', root: true}
    });
    // Generate kgramms and tfidf for 1 theme then for selected theme
    Theme.prototype.generateTFIDF = async function (){
        let data = [];
        const texts = await this.texts.find();
        
        for (let i = 0; i < 3; i++){
            const textsGramms = texts.map(text => {
                const textToken = cleanData(splitStringInput(text.content), true);
                return getGramm(i + 1, textToken); 
            });
            let corpus = {};
            textsGramms.forEach(gramms => {
                gramms.forEach(gramm => {
                    if (Reflect.has(corpus, gramm)){
                        corpus[gramm].push(getTFIDF(gramm, gramms, textsGramms));
                    }else{
                        Reflect.set(corpus, gramm, []);
                        corpus[gramm].push(getTFIDF(gramm, gramms, textsGramms));
                    }
                })
            });
            for (let key in corpus){
                const averageIDF = corpus[key].reduce((acc, curr) => acc + curr) / corpus[key].length;
                Reflect.set(corpus, key, averageIDF);
            }
            data.push({
                kgramm: i + 1,
                corpus
            });
        }

        this.data = data;
        await Theme.replaceOrCreate(this);
        return {
            status: "ok"
        }
    }
    Theme.remoteMethod('prototype.generateTFIDF', {
        accepts: [],
        returns: {arg: 'res', type: 'object', root: true}
    });

    function getTF(gramm, arrGramm){
        if (!is.string(gramm))
            throw new Error("gramm should be a string");
        if (!is.array(arrGramm) || arrGramm.length === 0)
            throw new Error("arrGram should be an array");
        let count = 0;
        arrGramm.forEach(element => {
            if (element === gramm)
                count++;
        });
        return count/arrGramm.length;
    }

    function getIDF(gramm, arrCorpus){
        if (!is.string(gramm))
            throw new Error("gramm should be a string");
        if (!is.array(arrCorpus) || arrCorpus.length === 0)
            throw new Error("arrCorpus should be an array");
        let count = 0;
        for (let document of arrCorpus){
            for (let token of document){
                if (token === gramm){
                    count++;
                    break;
                }
            }
        }
        return Math.log10(arrCorpus.length/count);
    }

    function getTFIDF(gramm, currentDocument, arrCorpus){
        return getTF(gramm, currentDocument) * getIDF(gramm, arrCorpus);
    }
    // Add text for one theme
    Theme.prototype.newData = async function (input, isNoise) {
        if (!is.string(input))
            throw new Error("Input should be a string"); // check how to make custom error response
        if (!is.boolean(isNoise))
            throw new Error("isNoise should be a boolean");
        const cleanedHistoInput = cleanData(input, isNoise);
        let newDataArray = [];
        let oldDataArray = this.data;
        for (let i = 0; i < 3; i++){ // Default 3-gramms !!!
            const grammsObject = countBy(getGramm(i + 1, [...cleanedHistoInput.keys()]));
            newDataArray.push({
                kgramm: i + 1,
                total: Object.keys(grammsObject).length,
                dataWithCount: grammsObject
            });
        }
        if (oldDataArray.length){
            this.data = mergeData(oldDataArray, newDataArray);
        }else{
            this.data = newDataArray;
        }
        await Theme.replaceOrCreate(this);
        // TODO: should be call by a bigger route to handle several theme
        return {
            ok: true
        }
    }

    Theme.remoteMethod('prototype.newData', {
        accepts: [
            {arg: 'input', type: 'string'},
            {arg: 'isNoise', type: 'boolean'}
        ],
        returns: {arg: 'res', type: 'object', root: true}
    });

  async function newDataOnTheme(input, isNoise, themeObject){
    if (!is.string(input)){
        throw new Error("Input should be a string"); // check how to make custom error response
    }
    if (!is.boolean(isNoise)){
        throw new Error("isNoise should be a boolean");
    }
    const cleanedHistoInput = cleanData(input, isNoise);
    let newDataArray = [];
    let oldDataArray = themeObject.data;
    for (let i = 0; i < 3; i++){ // Default 3-gramms !!! should be able to handle more gramms
        const grammsObject = countBy(getGramm(i + 1, [...cleanedHistoInput.keys()]));
        newDataArray.push({
            kgramm: i + 1,
            total: Object.keys(grammsObject).length,
            dataWithCount: grammsObject
        });
    }
    if (oldDataArray.length){
        themeObject.data = mergeData(oldDataArray, newDataArray);
    }else{
        themeObject.data = newDataArray;
    }
    return Theme.replaceOrCreate(themeObject);
  }

  function mergeData(firstData, secondData){ // TODO can improve this
      if (!is.array(firstData) || !is.array(secondData)){
        throw new Error("Arguments should be arrays");
      }
      let res = [];
      firstData.forEach(elFirst => {
          secondData.forEach(elSecond => {
            let tmp = [];
              if (elFirst.kgramm === elSecond.kgramm){
                  tmp.push(...getElement(elFirst.dataWithCount));
                  tmp.push(...getElement(elSecond.dataWithCount));
                  const grammsObject = countBy(tmp);
                  res.push({
                    kgramm: elFirst.kgramm,
                    total: Object.keys(grammsObject).length,
                    dataWithCount: grammsObject
                  });
              }
          })
      });
      return res;
  }

  function getElement(dataObject){ // can improve this one
      let tmp = []
        Object.entries(dataObject).forEach(el => {
        for (let i = 0; i < el[1]; i++){
            tmp.push(el[0]);
        }
      });
      return tmp;
  }

Theme.prototype.reset = async function () {
    this.data = [];
    const res = await Theme.replaceOrCreate(this);
    return {
      reset: "OK",
      value: res
    }
};

Theme.remoteMethod('prototype.reset', {
  accepts: [],
  returns: {arg: 'res', type: 'object', root: true}
});

  // Add text for several theme, calling route for one theme
  // first route is useless. use this one even if it's one 
Theme.texts = async function (inputData) {
    let {text, ids} = inputData;
    let themesPromise = [];
    let mergePromise = [];
    for(let el of ids){
        let res = Theme.findById(el);
        themesPromise.push(res);
    }
    const themes = await Promise.all(themesPromise);
    themes.forEach(el => {
        mergePromise.push(newDataOnTheme(text, true, el));
    });
    return {
        res: "OK"
    }
};

  Theme.remoteMethod('texts', {
    accepts: [{arg: 'input', type: 'object', http: { source: 'body' }}],
    returns: {arg: 'res', type: 'object', root: true}
  });

  Theme.prototype.deleteGramm = async function (grammKey, grammLevel){
      // grammKey should be a string grammLevle should be a number #is
      return {
        res: "OK"
    }
  }
  Theme.remoteMethod('prototype.deleteGramm', {
    accepts: [
        {arg: 'grammKey', type: 'string'},
        {arg: 'grammLevel', type: 'number'}
    ],
    returns: {arg: 'res', type: 'object', root: true}
  });

  Theme.prototype.disableGramm = async function (grammKey, grammLevel){
    // grammKey should be a string grammLevle should be a number #is
    return {
      res: "OK"
  }
}
    Theme.remoteMethod('prototype.disableGramm', {
        accepts: [
      {arg: 'grammKey', type: 'string'},
      {arg: 'grammLevel', type: 'number'}
  ],
  returns: {arg: 'res', type: 'object', root: true}
});

};
