export const ObjectType = Object.freeze({
  INTEGER_OBJ: "INTEGER",
  BOOLEAN_OBJ: "BOOLEAN",
  NULL_OBJ: "NULL",
});

class ObjectWrapper {
  constructor() {}

  type() {}

  inspect() {}
}

export class IntegerObject extends ObjectWrapper {
  constructor(value) {
    super();

    this.value = value;
  }

  type() {
    return ObjectType.INTEGER_OBJ;
  }

  inspect() {
    return this.value;
  }
}

export class BooleanObject extends ObjectWrapper {
  constructor(value) {
    super();
    this.value = value;
  }

  type() {
    return ObjectType.BOOLEAN_OBJ;
  }

  inspect() {
    return this.value;
  }
}

export class NullObject extends ObjectWrapper {
  constructor() {
    super();
  }

  type() {
    return ObjectType.NULL_OBJ;
  }

  inspect() {
    return "null";
  }
}
