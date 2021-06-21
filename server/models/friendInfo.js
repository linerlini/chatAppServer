class FriendInfo {
  constructor({
    account,
    name,
    lastword,
    notAcceptWordCount,
    signature,
    relationship,
    groupIndex,
  }) {
    this.account = account;
    this.name = name;
    this.lastword = lastword;
    this.notAcceptWordCount = notAcceptWordCount;
    this.signature = signature;
    this.relationship = relationship;
    this.groupIndex = groupIndex;
  }
}

module.exports = FriendInfo;
