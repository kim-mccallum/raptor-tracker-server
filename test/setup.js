require("dotenv").config();
const { expect } = require("chai");
const supertest = require("supertest");
const app = require("../src/app");

process.env.NODE_ENV = "test";

global.expect = expect;
global.supertest = supertest;
