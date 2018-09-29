<template lang="pug">
  .message-list
    article.media
      figure.media-left
        span.image.is-64x64
          img(src="https://firebasestorage.googleapis.com/v0/b/overwatch-pickem.appspot.com/o/images%2Fusers%2F52kfnGgOpxcc1tzeZvyWl3h59eG2.jpg?alt=media&token=8a22819d-441a-4a96-8f42-38cc3f31444d")
      .media-content
        .content
          span.date.is-pulled-right Sep 19, 2018
          span.from Morghal
          span.last-message Last message goes here.
</template>

<style lang="scss">
  .message-list {
    &:hover {
      opacity: 0.8;
      cursor: pointer;
    }
    .from {
      color: #fff;
      font-size: 1.4rem;
    }
    .last-message {
      display: block;
    }
    .date {
      font-size: .7rem;
    }
  }
</style>
