### 0.3.0

+ You can now export a nodejs readable stream instead of an array of
  build rules for cases when you need to do some things asynchronously
  to determine your build rules.

### 0.2.4

+ Write your build rules as nodejs functions while specifying inputs and
  outputs
+ Build rules get tranformed into ninja configuration
