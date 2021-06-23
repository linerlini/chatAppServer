class FriendInfo {
  constructor({
    account,
    name,
    lastword,
    notAcceptWordCount,
    signature,
    relationship,
    groupIndex,
    loginStatus,
  }) {
    this.account = account;
    this.name = name;
    this.lastword = lastword;
    this.notAcceptWordCount = notAcceptWordCount;
    this.signature = signature;
    this.relationship = relationship;
    this.groupIndex = groupIndex;
    this.loginStatus = loginStatus || 0;
  }
}

module.exports = FriendInfo;
