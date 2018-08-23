<template lang="pug">
  .styles
    section.section
      .container
        h1.title {{ pageTitle }}
        p.subtitle.overwatch-font This will be where we do some overwatch pickin'!
        p We can have some normal text too.  Thanks for all of this.  Hopefully we can get this to the point where people can place some picks to at least test this system out a bit.
    section.section
      .container
        h2.header-font.text-border Tables
        .box
          h3.overwatch-font Table Title
          hr
          table.table.is-fullwidth.is-striped.owp-orange-border
            thead
              tr
                th #
                th Team Name
                th Points
                th %
            tbody
              tr(v-for="(team, index) in teamData")
                td.position {{ index + 1 }}
                td {{ team.teamName }}
                td {{ team.points }}
                td {{ team.percentRight }}
    section.section
      .container
        h2.header-font.text-border New Pick'em Layout
        .box
          h3 Matchups
          .columns.is-gapless
            .column
              span Mar 15, 5:00 PM
            .column
              span SHD vs NYE
            .column
              span
                button.button.positive-button Fast Pick
            .column
              span
                button.button.positive-button Pick'em
          .columns.is-gapless
            .column
              span Mar 15, 5:00 PM
            .column
              span SHD vs NYE
            .column
              span
                button.button.positive-button Fast Pick
            .column
              span
                button.button.positive-button Pick'em
          .columns.is-gapless
            .column
              span Mar 15, 5:00 PM
            .column
              span SHD vs NYE
            .column
              span
                button.button.positive-button Fast Pick
            .column
              span
                button.button.positive-button Pick'em
          .columns.is-gapless
            .column
              span Mar 15, 5:00 PM
            .column
              span SHD vs NYE
            .column
              span
                button.button.positive-button Fast Pick
            .column
              span
                button.button.positive-button Pick'em

    section.section
      .container
        h2.header-font.text-border Common Elements
        .box
          h3.overwatch-font Buttons
          hr
          button.button.positive-button Positive Button
          button.button.negative-button Negative Button
          button.button.disabled-button Disabled Button
        .box
          h3.overwatch-font Text Elements
          hr
          h1 Header 1
          h2 Header 2
          h3 Header 3
          h4 Header 4
          h5 Header 5
          p.overwatch-font Paragraph with the overwatch font.
          p
            a(href="#") This is the default link style.
        .box
          h3.overwatch-font Form Elements
          hr
          .field
            label.label Input Label
            .control
              input.input(type='text', placeholder='This is placeholder text')
          .field
            label.label Another Label
            .control
              input.input(type='text', placeholder='Another one to toggle focus with.')
          .field
            label.label Fancy Toggle
            input#ispublic.tgl.tgl-flip(type = "checkbox")
            label.tgl-btn(data-tg-off = "Public", data-tg-on = "Private", for = "ispublic")
        .box
          h3.overwatch-font Image Dimensions
          hr
          ul
            li Organization Images: 250x250
            li Team Images: 250x250
            li Profile Images: (on Gravatar for now)
        .box
          h3.overwatch-font Table with pagination
          table.table.is-fullwidth.is-striped.owp-orange-border
            thead
              tr
                th First
                th Last
            paginate(name="persons" :list="pagingData" :per="10" tag="tbody")
              tr(v-for="person in paginated('persons')")
                td {{ person.name.first }}
                td {{ person.name.last }}
          paginate-links(for="persons" :hide-single-page="true")
          span(v-if="$refs.paginator") {{ $refs.paginator.pageItemsCount }} Members
</template>

<script>
  export default {
    name: 'styles',
    data () {
      return {
        pageTitle: 'Overwatch Pick \'em Styles',
        paginate: ['persons'],
        teamData: [
          {
            teamName: 'Matt\'s amazing team',
            points: 1200,
            percentRight: 80
          },
          {
            teamName: 'Bob\'s amazing team',
            points: 1000,
            percentRight: 76
          },
          {
            teamName: 'Tawni\'s amazing team',
            points: 870,
            percentRight: 65
          }
        ],
        pagingData: [
          {
            '_id': '5a54259cc354213f5cd25fd0',
            'name': {
              'first': 'Hayes',
              'last': 'Mcintyre'
            }
          },
          {
            '_id': '5a54259ce625ace6628925d6',
            'name': {
              'first': 'Georgina',
              'last': 'Sweet'
            }
          },
          {
            '_id': '5a54259c5c0ca8c7055cbddc',
            'name': {
              'first': 'Garrett',
              'last': 'Boyer'
            }
          },
          {
            '_id': '5a54259c08ec63bbb15be60b',
            'name': {
              'first': 'Vang',
              'last': 'Waller'
            }
          },
          {
            '_id': '5a54259c1ac470d62855eb75',
            'name': {
              'first': 'Kristina',
              'last': 'Frederick'
            }
          },
          {
            '_id': '5a54259ca674888add31304e',
            'name': {
              'first': 'Saunders',
              'last': 'Mullins'
            }
          },
          {
            '_id': '5a54259cce25800cdd71850f',
            'name': {
              'first': 'Mclean',
              'last': 'Paul'
            }
          },
          {
            '_id': '5a54259cc14736338d144c10',
            'name': {
              'first': 'Acosta',
              'last': 'Gallegos'
            }
          },
          {
            '_id': '5a54259c1993fdaf61b240d8',
            'name': {
              'first': 'Rosanna',
              'last': 'Allison'
            }
          },
          {
            '_id': '5a54259c281d30ff489b27aa',
            'name': {
              'first': 'Morrow',
              'last': 'Gregory'
            }
          },
          {
            '_id': '5a54259c8841c5171898ac8b',
            'name': {
              'first': 'April',
              'last': 'Skinner'
            }
          },
          {
            '_id': '5a54259c6f2b9a0545d08053',
            'name': {
              'first': 'Rowland',
              'last': 'Rojas'
            }
          },
          {
            '_id': '5a54259c32db4ec43b61c593',
            'name': {
              'first': 'Kris',
              'last': 'Snider'
            }
          },
          {
            '_id': '5a54259cc71c6fe46f0dd3e6',
            'name': {
              'first': 'Nita',
              'last': 'Ochoa'
            }
          },
          {
            '_id': '5a54259c79ac14f77af9dd95',
            'name': {
              'first': 'Doreen',
              'last': 'Mejia'
            }
          },
          {
            '_id': '5a54259c83665d71259ac4f6',
            'name': {
              'first': 'Briggs',
              'last': 'Mckenzie'
            }
          },
          {
            '_id': '5a54259c01ca80e2471afe4f',
            'name': {
              'first': 'Carissa',
              'last': 'Underwood'
            }
          },
          {
            '_id': '5a54259c9e49e73db8bb8c5f',
            'name': {
              'first': 'Jordan',
              'last': 'Sullivan'
            }
          },
          {
            '_id': '5a54259ce93a65b406919331',
            'name': {
              'first': 'Casey',
              'last': 'Erickson'
            }
          },
          {
            '_id': '5a54259cd9ad7dedf96aa0e3',
            'name': {
              'first': 'Casey',
              'last': 'Santiago'
            }
          },
          {
            '_id': '5a54259cdbf4324c6a43f54c',
            'name': {
              'first': 'Hines',
              'last': 'Sawyer'
            }
          },
          {
            '_id': '5a54259c7f431dfce1bc7488',
            'name': {
              'first': 'Tania',
              'last': 'Owen'
            }
          },
          {
            '_id': '5a54259c479d7c61014fdfea',
            'name': {
              'first': 'Dawn',
              'last': 'Charles'
            }
          },
          {
            '_id': '5a54259c05db98561832958e',
            'name': {
              'first': 'Malinda',
              'last': 'Acosta'
            }
          },
          {
            '_id': '5a54259c257a4c58a3b58a1c',
            'name': {
              'first': 'Woodard',
              'last': 'Nash'
            }
          },
          {
            '_id': '5a54259c5d29b7720e6cbdeb',
            'name': {
              'first': 'Corrine',
              'last': 'Meyer'
            }
          },
          {
            '_id': '5a54259c5d88287202d0e665',
            'name': {
              'first': 'Raymond',
              'last': 'Holden'
            }
          },
          {
            '_id': '5a54259c1b8a26c6c3d1e572',
            'name': {
              'first': 'Lou',
              'last': 'Gaines'
            }
          },
          {
            '_id': '5a54259c5c3b63e39f935a56',
            'name': {
              'first': 'Obrien',
              'last': 'Carlson'
            }
          },
          {
            '_id': '5a54259ca7aded4a5eb52f93',
            'name': {
              'first': 'Aurelia',
              'last': 'Winters'
            }
          },
          {
            '_id': '5a54259cd4bdb9e18e1e135e',
            'name': {
              'first': 'Mack',
              'last': 'Compton'
            }
          },
          {
            '_id': '5a54259c745e31f1da5d6a18',
            'name': {
              'first': 'Therese',
              'last': 'Newton'
            }
          },
          {
            '_id': '5a54259c3d76d511507c7bf7',
            'name': {
              'first': 'Bethany',
              'last': 'Frank'
            }
          },
          {
            '_id': '5a54259c1b040b0180a2b203',
            'name': {
              'first': 'Katheryn',
              'last': 'Logan'
            }
          },
          {
            '_id': '5a54259ca511c3e1225f1039',
            'name': {
              'first': 'Ruby',
              'last': 'Cleveland'
            }
          },
          {
            '_id': '5a54259c65a182f68afdbdcb',
            'name': {
              'first': 'Augusta',
              'last': 'Beach'
            }
          },
          {
            '_id': '5a54259cc0f6d5f406dc5250',
            'name': {
              'first': 'Craft',
              'last': 'Wiggins'
            }
          },
          {
            '_id': '5a54259c7fe5b1893b14dcff',
            'name': {
              'first': 'Stuart',
              'last': 'Velez'
            }
          },
          {
            '_id': '5a54259cc9cbb3260a0f2b04',
            'name': {
              'first': 'Victoria',
              'last': 'Guerrero'
            }
          },
          {
            '_id': '5a54259c000e49e9c08788a4',
            'name': {
              'first': 'Smith',
              'last': 'Hampton'
            }
          },
          {
            '_id': '5a54259caaee6a3f5b379d8b',
            'name': {
              'first': 'Rich',
              'last': 'Patterson'
            }
          },
          {
            '_id': '5a54259c30aac57782419ea9',
            'name': {
              'first': 'Ewing',
              'last': 'Hatfield'
            }
          },
          {
            '_id': '5a54259cf8d5ea985523160a',
            'name': {
              'first': 'Elliott',
              'last': 'Guthrie'
            }
          },
          {
            '_id': '5a54259c095a10f32c5f3b74',
            'name': {
              'first': 'Erickson',
              'last': 'Macdonald'
            }
          },
          {
            '_id': '5a54259cfa6fb1730c4625ec',
            'name': {
              'first': 'Nell',
              'last': 'Cannon'
            }
          },
          {
            '_id': '5a54259c45aa49c4312a6d4f',
            'name': {
              'first': 'Reba',
              'last': 'Pacheco'
            }
          },
          {
            '_id': '5a54259c3ab75d787045e499',
            'name': {
              'first': 'May',
              'last': 'Jordan'
            }
          },
          {
            '_id': '5a54259c3417545ac8930c25',
            'name': {
              'first': 'Bond',
              'last': 'Bridges'
            }
          },
          {
            '_id': '5a54259c73034d934130af18',
            'name': {
              'first': 'Katrina',
              'last': 'Kim'
            }
          },
          {
            '_id': '5a54259c63a1dc3de9357a66',
            'name': {
              'first': 'Wilkerson',
              'last': 'Cox'
            }
          },
          {
            '_id': '5a54259c086112edb297d957',
            'name': {
              'first': 'Ratliff',
              'last': 'Rowland'
            }
          },
          {
            '_id': '5a54259cb8a1b3e2ec349019',
            'name': {
              'first': 'Alberta',
              'last': 'Leon'
            }
          },
          {
            '_id': '5a54259ceae5f98d0443d3e9',
            'name': {
              'first': 'Alison',
              'last': 'Mendez'
            }
          },
          {
            '_id': '5a54259ca701eedf1ef15bd6',
            'name': {
              'first': 'Ora',
              'last': 'Hahn'
            }
          },
          {
            '_id': '5a54259c918835acfd8f0b01',
            'name': {
              'first': 'Sophia',
              'last': 'Berry'
            }
          },
          {
            '_id': '5a54259c60321c5a865c5d46',
            'name': {
              'first': 'Ericka',
              'last': 'Terrell'
            }
          },
          {
            '_id': '5a54259ceb142b815cf13825',
            'name': {
              'first': 'Stephanie',
              'last': 'Bruce'
            }
          },
          {
            '_id': '5a54259cb49bad8eb7abefcf',
            'name': {
              'first': 'Mandy',
              'last': 'Weiss'
            }
          }
        ]
      }
    }
  }
</script>

<style lang="scss">
  @import '../variables.scss';
</style>