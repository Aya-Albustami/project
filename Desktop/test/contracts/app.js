App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    // Load pets.
    $.getJSON('../Election.json', function(candidatePerson) {
      var Row1 = $('#Row1');
      var Template1 = $('#Template1');

      var Row2 = $('#Row2');
      var Template2 = $('#Template2');

      for (i = 0; i < person.length; i ++) {
        Template1.find('img').attr('src', person[i].id);
        Template1.find('.panel-title').text(person[i].name);
        Template1.find('img').attr('src', person[i].col);

        petsRow.append(Template1.html());
      }

      for (i = 0; i < list.length; i ++) {
        Template2.find('img').attr('src', list[i].id);
        Template2.find('.panel-title').text(list[i].name);

        petsRow.append(Template2.html());
      }
    });

    return await App.initWeb3();
  },

  initWeb3: async function() {
   // TODO: refactor conditional
   if (typeof web3 !== 'undefined') {
    // If a web3 instance is already provided by Meta Mask.
    App.web3Provider = web3.currentProvider;
    web3 = new Web3(web3.currentProvider);
  } else {
    // Specify default instance if no web3 instance provided
    App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    web3 = new Web3(App.web3Provider);
  }
  
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("Election.json", function(election) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Election = TruffleContract(election);
      // Connect provider to interact with contract
      App.contracts.Election.setProvider(App.web3Provider);

      App.listenForEvents();

      return App.render();
    });
  },

 // Listen for events emitted from the contract
 listenForEvents: function() {
  App.contracts.Election.deployed().then(function(instance) {
    // Restart Chrome if you are unable to receive this event
    // This is a known issue with Metamask
    // https://github.com/MetaMask/metamask-extension/issues/2393
    instance.votedEvent({}, {
      fromBlock: 0,
      toBlock: 'latest'
    }).watch(function(error, event) {
      console.log("event triggered", event)
      // Reload when a new vote is recorded
      App.render();
    });
  });
}, 

render: function() {
  var electionInstance;
  var loader = $("#loader");
  var content = $("#content");

  loader.show();
  content.hide();

  // Load account data
  web3.eth.getCoinbase(function(err, account) {
    if (err === null) {
      App.account = account;
      $("#accountAddress").html("Your Account: " + account);
    }
  });

  // Load contract data
  //person
  App.contracts.Election.deployed().then(function(instance) {
    electionInstance = instance;
    return electionInstance.person.length();
  }).then(function(listperson) {
    var candidatesResults1 = $("#candidatesResults1");
    candidatesResults1.empty();

    var candidatesSelect1 = $('#candidatesSelect1');
    candidatesSelect1.empty();

    for (var i = 1; i <= person.length; i++) {
      electionInstance.person(i).then(function(candidatePerson) {
        var id = candidatePerson[0];
        var name = candidatePerson[1];
        var voteCount = candidatePerson[2];
        var col = candidatePerson[3];

        // Render candidate Result
        var candidateTemplate1 = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + voteCount + "<tr><th>" + col + "</td></tr>"
        candidatesResults1.append(candidateTemplate1);

        // Render candidate ballot option
        var candidateOption1 = "<option value='" + id + "' >" + name + "</ option>"
        candidatesSelect1.append(candidateOption1);
      });
    }

    //list
    App.contracts.Election.deployed().then(function(instance) {
      electionInstance = instance;
      return electionInstance.list.length();
    }).then(function(listlists) {
      var candidatesResults2 = $("#candidatesResults2");
      candidatesResults2.empty();
  
      var candidatesSelect2 = $('#candidatesSelect2');
      candidatesSelect2.empty();
  
      electionInstance.person(i).then(function(candidateList) {
        var id = candidateList[0];
        var name = candidateList[1];
        var voteCount = candidateList[2];

  
          // Render candidate Result
          var candidateTemplate2 = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + voteCount + "</td></tr>"
          candidatesResults2.append(candidateTemplate2);
  
          // Render candidate ballot option
          var candidateOption2 = "<option value='" + id + "' >" + name + "</ option>"
          candidatesSelect2.append(candidateOption2);
        });
      }
   // return electionInstance.voters(App.account);
  }).then(function(hasVoted) {
    // Do not allow a user to vote
    if(hasVoted) {
      $('form').hide();
    }
    loader.hide();
    content.show();
  }).catch(function(error) {
    console.warn(error);
  });
}
};

$(function() {
$(window).load(function() {
  App.init();
});
});