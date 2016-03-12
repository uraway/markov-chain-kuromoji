'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _kuromoji = require('kuromoji');

var _kuromoji2 = _interopRequireDefault(_kuromoji);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MarkovChain = function () {
  function MarkovChain(text) {
    _classCallCheck(this, MarkovChain);

    this.text = text;
    this.result = null;
    this.dictionary = {};
    this.output = 'output';
  }

  _createClass(MarkovChain, [{
    key: 'start',
    value: function start(sentence, callback) {
      this.parse(sentence, callback);
    }
  }, {
    key: 'parse',
    value: function parse(sentence, callback) {
      var _this = this;

      _kuromoji2.default.builder({ dicPath: 'node_modules/kuromoji/dist/dict/' }).build(function (err, tokenizer) {
        var path = tokenizer.tokenize(_this.text);
        _this.dictionary = _this.makeDic(path);
        _this.makeSentence(_this.dictionary, sentence);
        callback(_this.output);
      });
    }
  }, {
    key: 'makeDic',
    value: function makeDic(items) {
      var tmp = ['@'];
      var dic = {};
      for (var i in items) {
        var t = items[i];
        var word = t.surface_form;
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
  }, {
    key: 'setWord3',
    value: function setWord3(p, s3) {
      var w1 = s3[0];
      var w2 = s3[1];
      var w3 = s3[2];
      if (p[w1] == undefined) p[w1] = {};
      if (p[w1][w2] == undefined) p[w1][w2] = {};
      if (p[w1][w2][w3] == undefined) p[w1][w2][w3] = 0;
      p[w1][w2][w3]++;
    }
  }, {
    key: 'makeSentence',
    value: function makeSentence(dic, sentence) {
      for (var i = 0; i < sentence; i++) {
        var ret = [];
        var top = dic['@'];
        if (!top) continue;
        var w1 = this.choiceWord(top);
        var w2 = this.choiceWord(top[w1]);
        ret.push(w1);
        ret.push(w2);
        for (;;) {
          var w3 = this.choiceWord(dic[w1][w2]);
          ret.push(w3);
          if (w3 == '。') break;
          w1 = w2, w2 = w3;
        }

        this.output = ret.join('');
        return this.output;
      }
    }
  }, {
    key: 'objKeys',
    value: function objKeys(obj) {
      var r = [];
      for (var i in obj) {
        r.push(i);
      }

      return r;
    }
  }, {
    key: 'choiceWord',
    value: function choiceWord(obj) {
      var ks = this.objKeys(obj);
      var i = this.rnd(ks.length);
      return ks[i];
    }
  }, {
    key: 'rnd',
    value: function rnd(num) {
      return Math.floor(Math.random() * num);
    }
  }]);

  return MarkovChain;
}();

module.exports = MarkovChain;