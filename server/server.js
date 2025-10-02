import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import bycrypt from "bcrypt";
import dns from "dns";
import { nanoid } from "nanoid";
import jwt from "jsonwebtoken";
import cors from "cors";

// schemas
import User from "./Schema/User";
