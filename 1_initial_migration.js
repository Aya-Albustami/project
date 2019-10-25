const Migrations = artifacts.require("Migrations");
const Election = artifacts.require("Election");


module.exports = function(deployer) {
  deployer.deploy(Migrations);

  deployer.deploy(Election);

};
