<template lang="pug">
  .message-box
    h3.has-pointer(@click="showBox = !showBox") Messages
    .messages(v-if="showBox")
      b-tabs(v-model="activeTab")
        b-tab-item(label="Recent")
          article.media
            figure.media-left
              .image.is-32x32
                img(src="https://bulma.io/images/placeholders/128x128.png")
            .media-content
              .content
                span Sneaky Crow
                span.is-block.mice 3/16/2019
          article.media
            figure.media-left
              .image.is-32x32
                img(src="https://bulma.io/images/placeholders/128x128.png")
            .media-content
              .content
                span Sneaky Crow
                span.is-block.mice 3/16/2019
          article.media
            figure.media-left
              .image.is-32x32
                img(src="https://bulma.io/images/placeholders/128x128.png")
            .media-content
              .content
                span Sneaky Crow
                span.is-block.mice 3/16/2019
          article.media
            figure.media-left
              .image.is-32x32
                img(src="https://bulma.io/images/placeholders/128x128.png")
            .media-content
              .content
                span Sneaky Crow
                span.is-block.mice 3/16/2019
          article.media
            figure.media-left
              .image.is-32x32
                img(src="https://bulma.io/images/placeholders/128x128.png")
            .media-content
              .content
                span Sneaky Crow
                span.is-block.mice 3/16/2019
        b-tab-item(label="Convo")
          .conversation
            .left
              span.orange Sneaky Crow
              span.is-block This is my message, I just wanted to say hi!
              span.is-block.mice 3/16/2019 2:15 am
            .right
              span.orange SouldrinK
              span.is-block Why hello there!  What can I help you with?
              span.is-block.mice 3/16/2019 2:27 am
          b-input(type="textarea" rows="2")
          button.button.is-primary.is-small Send
</template>

<script>
export default {
  name: 'Messages',
  data () {
    return {
      activeTab: '',
      showBox: false
    }
  }
}
</script>

<style lang="scss">
  .message-box {
    position: fixed;
    transform: translate3d(0, 0, 0);
    z-index: 999;
    width: 260px;
    bottom: 0;
    right: 20px;
    background-color: #090c1c;
    border-radius: 8px 8px 0 0;
    h3 {
      text-align: center;
    }
    .conversation {
      .left, .right {
        font-size: .8rem;
        border-bottom: 1px solid #fff;
        padding-bottom: .25rem;
        margin-bottom: .25rem;
      }
      .right {
        text-align: right;
      }
    }
    .button {
      margin-top: .25rem;
    }
  }
</style>
