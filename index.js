
/**
 * Prototype of a validator function.
 * 
 * @callback validatorFunction
 * @param {any} value Value to be validated.
 * @returns {boolean} Result of the validation.
 */

class ScoringModel {
    /**
     * A model that determines how an object can be scored.
     * 
     * @param {string} name Name of the model.
     */
  constructor(name) {
    this.name = name;
    this._fields = [];
  }

  /**
   * The total weights for this model.
   */
  get weights() {
    return this._fields.reduce((prev, curr) => prev + curr.weight, 0);
  }

  /**
   * Add a new field to this scoring model.
   * 
   * @param {string} name Exact name of the field to score.
   * @param {float} [weight=1.0] Max score possible from this field. This weight will
   * be divided equally between all validators on this field.
   */
  field(name, weight=1.0) {
    let field = this._fields.find(f => f.name === name);

    if (field === undefined) {
      field = new ScoringField(name, weight);
      this._fields.push(field);
    }

    return field;
  }

  /**
   * Score an individual object against this model.
   * 
   * @param {Object} data Object to score using this model.
   * @param {boolean} [showMessages=false] Set to true to return detailed messages 
   * for each field explaining the score.
   */
  score(data, showMessages=false) {
    let score = 0;
    const fieldResults = {};

    for (let field of this._fields) {
      const results = field.score(data[field.name]);
      score += results.score;
      fieldResults[field.name] = results;
    }

    if (showMessages) {
      return { score, fields: fieldResults };
    } else {
      return score;
    }
  }

  /**
   * Simple factory to create a model.
   * 
   * @param {string} name Name for the new model.
   */
  static create(name) {
    return new ScoringModel(name);
  }
}

class ScoringField {
  /**
   * Create a new field.
   * 
   * @param {string} name Name of the key to for this field.
   * @param {float} [weight=1.0] Max score possible from this field. This weight will
   * be divided equally between all validators on this field.
   */
  constructor(name, weight=1.0) {
    this.name = name;
    this.weight = weight;
    this._validators = [];
  }

  /**
   * Set the weight of this field.
   * 
   * @param {float} value Set weight of this field to value.
   */
  setWeight(value) {
    this.weight = value;
    return this;
  }

  /**
   * Add a new validator to the list that will be applied to this field.
   * 
   * @param {validatorFunction} func A function that receives a value and determines
   * whether or not that value passes a validation.
   * @param {string} message Message to be returned if showMessages is enabled
   * during scoring.
   */
  validator(func, message) {
    this._validators.push({ func, message });
    return this;
  }

  /**
   * Score a value against the validators in this field.
   * 
   * @param {any} value Value to run through validators.
   */
  score(value) {
    let score = 0;
    const messages = [];
    const weightPerValidator = this.weight / (this._validators.length + 1);

    if (value !== undefined && value !== null) {

      // Value exists. Increase score for that
      score += weightPerValidator;

      for (let { func, message } of this._validators) {
        const passed = func(value);

        if (passed) {
          score += weightPerValidator;
        } else if (message !== undefined && message !== null) {
          messages.push(message);
        }
      }
    } else {
      messages.push(`Field ${this.name} is not defined.`);
    }

    return { score, messages };
  }
}

module.exports = { ScoringModel, ScoringField };
