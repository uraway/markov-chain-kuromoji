import fs from 'fs';
import kuromoji from 'kuromoji';

class MarkovChain {
  constructor(text) {
    this.text = text;
    this.result = null;
    this.dictionary = {};
    this.output = 'output';
  }

  start(sentence, callback) {
    this.parse(sentence, callback);
  }

  parse(sentence, callback) {
    kuromoji.builder({ dicPath: 'node_modules/kuromoji/dist/dict/' }).build((err, tokenizer) => {
      let path = tokenizer.tokenize(this.text);
      this.dictionary = this.makeDic(path);
      this.makeSentence(this.dictionary, sentence);
      callback(this.output);
    });
  }

  makeDic(items) {
    let tmp = ['@'];
    let dic = {};
    for (let i in items) {
      let t = items[i];
      let word = t.surface_form;
      word = word.replace(/\s*/, '');

      if (word == '' || word == 'EOS') continue;
      tmp.push(word);
      if (tmp.length < 3) continue;
      if (tmp.length > 3) tmp.splice(0, 1);

      this.setWord3(dic, tmp);

      if (word == '。') {
        tmp = ['@'];
        continue;
      }
    }

    return dic;
  }

  setWord3(p, s3) {
    let w1 = s3[0];
    let w2 = s3[1];
    let w3 = s3[2];
    if (p[w1] == undefined) p[w1] = {};
    if (p[w1][w2] == undefined) p[w1][w2] = {};
    if (p[w1][w2][w3] == undefined) p[w1][w2][w3] = 0;
    p[w1][w2][w3]++;
  }

  makeSentence(dic, sentence) {
    for (var i = 0; i < sentence; i++) {
      let ret = [];
      let top = dic['@'];
      if (!top) continue;
      let w1 = this.choiceWord(top);
      let w2 = this.choiceWord(top[w1]);
      ret.push(w1);
      ret.push(w2);
      for (;;) {
        let w3 = this.choiceWord(dic[w1][w2]);
        ret.push(w3);
        if (w3 == '。') break;
        w1 = w2, w2 = w3;
      }

      this.output = ret.join('');
      return this.output;
    }
  }

  objKeys(obj) {
    var r = [];
    for (var i in obj) {
      r.push(i);
    }

    return r;
  }

  choiceWord(obj) {
    var ks = this.objKeys(obj);
    var i = this.rnd(ks.length);
    return ks[i];
  }

  rnd(num) {
    return Math.floor(Math.random() * num);
  }
}

module.exports = MarkovChain;
