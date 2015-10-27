exports.seed = function(knex, Promise) {
  return Promise.join(
    knex('publishedProjects').insert({
      title: 'sinatra-contrib',
      tags: 'ruby, sinatra, community, utilities',
      description: 'Hydrogen atoms Sea of Tranquility are creatures of the cosmos shores of the cosmic ocean.',
      date_created: '2015-06-03T16:21:58+00:00',
      date_updated: '2015-06-03T16:41:58+00:00'
    }),
    knex('projects').where('id', 2)
    .update({
      published_id: 1
    })
  );
};
