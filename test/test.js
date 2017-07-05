const assert = require('assert');
const expect = require('chai').expect;
const { ScoringField, ScoringModel } = require('../index');

describe('ScoringField', function() {
  describe('#score()', function() {
    it('should set field as invalid if value is required but null or undefined was passed', function() {
      const expectedResults = { score: 0, messages: ['Field Test is not defined.'], valid: false };
      const field = new ScoringField('Test', 1, true);

      let results = field.score(undefined);
      expect(results).to.deep.equal(expectedResults);

      results = field.score(null);
      expect(results).to.deep.equal(expectedResults);
    });

    it('should set field as invalid if a required validator was failed', function() {
      const expectedResults = { score: 0, messages: ['Validator Failed'], valid: false };
      const field = new ScoringField('Test');

      field.validator((value) => false, 'Validator Failed', true);
      const results = field.score('abcd');
      expect(results).to.deep.equal(expectedResults);
    });

    it('should set field as valid if a field is not required and undefined or null was passed', function() {
      const expectedResults = { score: 0, messages: ['Field Test is not defined.'], valid: true };
      const field = new ScoringField('Test', 1, false);

      const results = field.score(undefined);
      expect(results).to.deep.equal(expectedResults);
    });

    it('should set score to full if all validators passed', function() {
      const expectedResults = { score: 1, messages: [], valid: true };
      const field = new ScoringField('Test');

      field.validator((value) => true, 'Validator should pass', true);
      const results = field.score('abcd');
      expect(results).to.deep.equal(expectedResults);
    });

    it('should set score to 2/3 of full score if half of validators passed', function() {
      const expectedResults = { score: 2, messages: ['Validator should fail'], valid: true };

      // Set total score to 3 because of default validator for undefined
      const field = new ScoringField('Test', 3);

      field.validator((value) => true, 'Validator should pass');
      field.validator((value) => false, 'Validator should fail');
      const results = field.score('abcd');
      expect(results).to.deep.equal(expectedResults);
    });
  });

  describe('#setWeight()', function() {
    it('should modify the total weight of a field', function() {
      const field = new ScoringField('Test');

      expect(field.weight).to.equal(1);
      field.setWeight(2);
      expect(field.weight).to.equal(2);
    });

    it('should throw an error if the value passed in is not a number', function() {
      const field = new ScoringField('Test');

      expect(field.setWeight.bind(field, 'string')).to.throw(TypeError);
      
      expect(field.setWeight.bind(field, 1.5)).to.not.throw(TypeError);
      expect(field.setWeight.bind(field, 1)).to.not.throw(TypeError);
    });
  });
});