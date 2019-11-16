// ===================
// ======PUERTO=======
// ===================
process.env.PORT = process.env.PORT || 3000;

// ===================
// ======ENTORNO=======
// ===================
process.env.NODE_ENV = process.env.NODE_ENV || "dev";

// ===================
// ======ENTORNO=======
// ===================
process.env.URLDB =
    process.env.NODE_ENV === "dev" ?
    "mongodb://localhost:27017/cafe" :
    "mongodb+srv://strider:Ew7v3GLpy26QXYnY@cluster0-pjlf4.mongodb.net/cafe";