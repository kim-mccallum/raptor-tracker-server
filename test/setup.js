const { expect } = require("chai");
const supertest = require("supertest");

// Am I setting this correctly?
process.env.NODE_ENV = "test";

global.expect = expect;
global.supertest = supertest;
