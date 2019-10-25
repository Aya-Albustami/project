pragma solidity ^0.5.2;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

import "openzeppelin-solidity/contracts/math/SafeMath.sol";


contract Election is Ownable {
//    event vote();
    using SafeMath for uint256;
 //uint public candidatesCountPerson;
 //uint public candidatesCountList;
struct candidatePerson{ 
   uint id;
   string name;
   uint votecount;  
   uint col;
}
struct candidateList{
   uint id;
   string name;
   uint votecount;  
}
candidatePerson[] public person;
candidateList[] public list;
//accounts that have voted
// list of uni students
mapping(address => uint) studentsAdd;
mapping (address => bool) public voters;
mapping(address => bool) public candidates; //check that person cant vote 
//display result for each candidate
//mapping (uint => candidatePerson) candidatePersonCount;
//mapping (uint => candidateList) candidateListCount;
modifier timer {
    require (now >= 8 hours,"Election is done");
    _;
}

function addStudents(address[] memory  add, uint[] memory col) public timer{
require(candidates[msg.sender]);
//     require (add =! person.id ); 
    for(uint i= 0; i < add.length; i++ ) {
        studentsAdd[add[i]] = col[i];
    }
}

function createCandidatePerson(string memory  _name, uint _col) public onlyOwner {
 uint key =  person.push(candidatePerson(0,_name, 0 , _col)) - 1; 
 person[key].id = key;
} 
function createCandidateList(string memory _name) public onlyOwner{
  uint id = list.push(candidateList(0,_name,0)) -1 ;
  list[id].id = id; 
}
function voting(uint _candidateId)public timer {    
require(!voters[msg.sender],"You Have Voted Before"); //check if user have voted before
require(studentsAdd[msg.sender] == person[_candidateId].col); // check student col if it equal to candidate col
// require to valid candidate(person)
voters[msg.sender] = true; //user have vote
person[_candidateId].votecount=person[_candidateId].votecount.add(1);
list[_candidateId].votecount=list[_candidateId].votecount.add(1);
// candidatePersonCount[_candidateId].votecount= candidatePersonCount[_candidateId].votecount.add(1);
// candidateListCount[_candidateId].votecount= candidateListCount[_candidateId].votecount.add(1);
}

//to disply result for every candidate
function getCountP(uint _candidateId) timer public view returns (uint) { 
    return person[_candidateId].votecount;
}

function getCountL(uint _candidateId) timer public view returns (uint) {
    return list[_candidateId].votecount;
}
 //final result
function resultP() public view returns(uint) {
    uint max=0;
for(uint i=0; i<person.length;i++){
    if(person[i].votecount > max)
        max=person[i].id;
}
return max;
}

function resultL() public view returns(uint) {
    uint max=0;
for(uint i=0; i<list.length;i++){
    if(list[i].votecount > max)
        max=list[i].id;
}
return max;
}



}