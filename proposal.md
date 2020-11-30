Project Proposal CS-410 / Fall 2020
==

1. What are the names and NetIDs of all your team members? Who is the captain? The captain will have more administrative duties than team members.

jaimeg4 (Individual)

2. What is your free topic? Please give a detailed description. What is the task? Why is it important or interesting? What is your planned approach? What tools, systems or datasets are involved? What is the expected outcome? How are you going to evaluate your work?

- Topic (Free):

Chicago Food Instagram Crawler.

- Description:

Provide an easy way to find up-to-date food options for the Chicago area using Instagram as the source.

- Task:

Instagram has a public API that provides access to recent the posts, and with the help of the hashtags we can determine if it’s a post related to food; if that’s the case a crawler will extract the coordinates used for the location and a classifier will try to guess the food category, finally the information will be saved into a database and exposed throught a REST API.

- Important:

At the moment there are a couple of alternatives like Ubereats or Yelp, however sometimes their data is outdated or their pictures are of poor quality; so the importance of the project is to provide up-to-date information and quality pictures using the Instagram community.

- Approach & Tools:
To mention some of the components needed:

a) Instagram crawler (Nodejs script).

b) Food classifier (Tensorflow.js).

c) Food API (Express nodejs).

d) Web application  (Svelte Javascript Framework).

- Outcome:

An interactive web application that will show Chicago food options and a way to filter them by categories (classifiers).

- Evaluation:

The project will be evaluated by the progress of the web application, which will be a Proof-of-Concept.
