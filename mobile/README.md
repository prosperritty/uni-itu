# Build
Our application is using Expo:
```console
$ npm install
...
$ npx expo start
...
```

# My part of implementation

Main parts that i have implemented:

- Simplified account login
- Navigation
- Finance page
- Profile page

# Navigation
I used `@react-navigation` library to implement navigation in our application. Navigation allows you to switch between the following pages: home, tasks, events, finance and profile.
<p align="center">
  <img src="../img/navigation.gif" alt="Navigation" height="500">
</p>

# Finance page
### Budget inline editing
The family budget can be directly changed by clicking on the value of the current budget.
<p align="center">
  <img src="../img/budget-inline.gif" alt="Budget inline">
</p>

### Adding transaction
A transaction can be added from the finance page by clicking **Add** button.
<p align="center">
  <img src="../img/adding-transaction.gif" alt="Transaction creating" height="500">
</p>

### Deleting transaction
A transaction can be deleted from the transactions page by clicking the cross button. A transaction can be also deleted from certain jar page.
<p align="center">
  <img src="../img/deleting-transaction.gif" alt="Transaction deleting" height="500">
</p>

### Filtering transaction
Transactions can be filtered from the transactions page.
<p align="center">
  <img src="../img/transactions-filtering.gif" alt="Transaction filtering" height="500">
</p>

### Creating and deleting jar
A jar can be created on the home page and finance page, and can also be deleted on a jar page.
<p align="center">
  <img src="../img/jar-creating-deleting.gif" alt="Jar creation and deleting" height="500">
</p>

### Adding an amount to a jar
There are two ways to add an amount to the jar, from the finance page and from the page of this jar.
<p align="center" justify="center">
  <img src="../img/adding-to-jar1.gif" alt="Adding amount to jar first" height="500" width="auto">
  <img src="../img/adding-to-jar2.gif" alt="Adding amount to jar second" height="500" width="auto">
</p>

### Updating deadline of jar
Jar deadline can be updated from its own page.
<p align="center">
  <img src="../img/deadline.gif" alt="Jar deadline">
</p>

### Jar inline editing
Some information about jar can be directly changed by clicking on the value.
<p align="center">
  <img src="../img/jar-inline.gif" alt="Jar inline">
</p>

# Profile page
Each family member can see his own profile and the profile of other family members. In each profile, you can track activity in the application and achievements.
<p align="center">
  <img src="../img/profiles.gif" alt="Profiles" height="500">
</p>

### Change profile picture
Each family member can change their profile picture.
<p align="center">
  <img src="../img/profile-picture.gif" alt="Profile picture" height="500">
</p>