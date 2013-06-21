var git = require('../').raw;

var helper = {
  // Test if obj is a true function
  testFunction: function(test, obj, label) {
    // The object reports itself as a function
    test(typeof obj, 'function', label +' reports as a function.');
    // This ensures the repo is actually a derivative of the Function [[Class]]
    test(toString.call(obj), '[object Function]', label +' [[Class]] is of type function.');
  },
  // Test code and handle exception thrown
  testException: function(test, fun, label) {
    try {
      fun();
      test(false, label);
    }
    catch (ex) {
      test(true, label);
    }
  }
};

/**
 * Commit
 */
exports.constructor = function(test){
  test.expect(3);

  // Test for function
  helper.testFunction(test.equals, git.Commit, 'Commit');
  git.Repo.open('../.git', function(err, repo) {
    // Ensure we get an instance of Commit
    test.ok(new git.Commit(repo) instanceof git.Commit, 'Invocation returns an instance of Commit');

    test.done();
  });
};

/**
 * Commit::Lookup
 */
exports.lookup = function(test) {
  test.expect(7);

  var testOid = git.Oid.fromString('cb76e3c030ab29db332aff3b297dc39451a84762'),
      testCommit = new git.Commit();

  // Test for function
  helper.testFunction(test.equals, testCommit.lookup, 'Commit::Lookup');

  git.Repo.open('../.git', function(error, repo) {
    // Test repo argument existence
    helper.testException(test.ok, function() {
      testCommit.lookup();
    }, 'Throw an exception if no repo');

    // Test oid argument existence
    helper.testException(test.ok, function() {
      testCommit.lookup(repo);
    }, 'Throw an exception if no oid');

    // Test callback argument existence
    helper.testException(test.ok, function() {
      testCommit.lookup(repo);
    }, 'Throw an exception if no callback');

    // Test that all arguments result correctly
    helper.testException(test.ifError, function() {
      testCommit.lookup(repo, testOid, function() {});
    }, 'No exception is thrown with proper arguments');
    // Test valid commit
    testCommit.lookup(repo, testOid, function(err) {
      test.equal(null, err, 'Valid commit');
      test.done();
    });
  });
};
