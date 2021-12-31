const express = require('express');
const router = express.Router();
const { ensureAuthenticated , authorizeRoles } = require('../config/checkAuth')
//------------ User Model ------------//
const User = require('../models/User');
const Queryy = require('../models/Query');
const Announces = require('../models/Annouce');
//------------ Welcome Route ------------//
router.get('/', (req, res) => {
    res.render('login');
});
router.get('/home', (req, res) => {
  res.render('home');
});

//------------ Dashboard Route ------------//
router.get('/dashboard', ensureAuthenticated, authorizeRoles("user"), (req, res) => res.render('dash', {
    name: req.user.name
}));
router.get('/authority_dashboard', ensureAuthenticated,authorizeRoles("authority"), (req, res) => res.render('dash1', {
  name: req.user.name
}));
router.get('/contact', (req, res) => res.render('contact_us', {
  
}));



router.get('/submit_query',ensureAuthenticated,authorizeRoles("user"),(req, res) => res.render('submit_query',{
  email: req.user.email,
  name: req.user.name,
  phoneno:req.user.phoneno,
  hostal: req.user.hostal
  
}));



router.get('/announcement', ensureAuthenticated,authorizeRoles("user"), function(req, res , next) {
  
  Announces.find(function(err, users) {
    if (err) {
      console.log(err);
    } else {
      res.render('announcement', { users: users  });
      console.log(users);
    }
}); 
});


router.get('/announcement1', ensureAuthenticated, authorizeRoles("admin"),function(req, res , next) {
  
  Announces.find(function(err, users) {
    if (err) {
      console.log(err);
    } else {
      res.render('announcement1', { users: users  });
      console.log(users);
    }
}); 
});
router.get('/announcement2', ensureAuthenticated,authorizeRoles("authority"), function(req, res , next) {
  
  Announces.find(function(err, users) {
    if (err) {
      console.log(err);
    } else {
      res.render('announcement2', { users: users  });
      console.log(users);
    }
}); 
});

router.get('/view_query', ensureAuthenticated, authorizeRoles("user"),function(req, res , next) {
  email: req.user.email,
  
  Queryy.find( {email1: req.user.email},function(err, users) {
    if (err) {
      console.log(err);
    } else {
      res.render('view_query', { users: users });
      console.log(users);
    }
}); 
});
router.get('/view_all_students', ensureAuthenticated,authorizeRoles("authority"), function(req, res , next) {
  
  User.find({role:"user"}, function(err, users) {
    if (err) {
      console.log(err);
    } else {
      res.render('view_all_students', { users: users });
      console.log(users);
    }
}); 
});
router.get('/view_all_students1', ensureAuthenticated,authorizeRoles("admin"), function(req, res , next) {
  hostal:req.user.hostal
  User.find({role:"user" , hostal:req.user.hostal}, function(err, users) {
    if (err) {
      console.log(err);
    } else {
      res.render('view_all_students1', { users: users });
      console.log(users);
    }
}); 
});
router.get('/view_all_admins', ensureAuthenticated,authorizeRoles("authority"), function(req, res , next) {
  
  User.find({role:"admin"}, function(err, users) {
    if (err) {
      console.log(err);
    } else {
      res.render('view_all_admins', { users: users });
      console.log(users);
    }
}); 
});
router.get('/view_all_incharges', ensureAuthenticated,authorizeRoles("authority"), function(req, res , next) {
  
  User.find({role:"incharge"}, function(err, users) {
    if (err) {
      console.log(err);
    } else {
      res.render('view_all_incharges', { users: users });
      console.log(users);
    }
}); 
});
router.get('/view_all_incharges1', ensureAuthenticated,authorizeRoles("admin"), function(req, res , next) {
  
  User.find({role:"incharge"}, function(err, users) {
    if (err) {
      console.log(err);
    } else {
      res.render('view_all_incharges1', { users: users });
      console.log(users);
    }
}); 
});
router.get('/admin_dashboard', ensureAuthenticated, authorizeRoles("admin"),function(req, res , next) {
  Queryy.find({status :"inprocess"},function(err, users) {
    if (err) {
      console.log(err);
    } else {
      res.render('admin_dash', { users: users });
      console.log(users);
    }
}); 
});
router.get('/incharge_dashboard', ensureAuthenticated,authorizeRoles("incharge"), function(req, res , next) {
  email:req.user.email
  Queryy.find({incharge_email: req.user.email , status: "Forwarded"},function(err, users) {
    if (err) {
      console.log(err);
    } else {
      res.render('incharge_dash', { users: users });
      console.log(users);
    }
}); 
});
router.get('/view_all_queries', ensureAuthenticated, function(req, res , next) {
 
  Queryy.find(function(err, users) {
    if (err) {
      console.log(err);
    } else {
      res.render('view_all_queries', { users: users });
      console.log(users);
    }
}); 
});
router.get('/incharge_own_dashboard', ensureAuthenticated,authorizeRoles("incharge"), function(req, res , next) {
  email:req.user.email
  Queryy.find({incharge_email: req.user.email ,  $or: [ { status: "Committed" }, {status: "Committed1" },{status: "Resolved" } ]},function(err, users) {
    if (err) {
      console.log(err);
    } else {
      res.render('incharge_dash', { users: users });
      console.log(users);
    }
}); 
});

router.get('/admin_own_dashboard', ensureAuthenticated,authorizeRoles("admin"), function(req, res , next) {
  email: req.user.email
  Queryy.find({assigner_email: req.user.email}, function(err, users) {
    if (err) {
      console.log(err);
    } else {
      res.render('admin_own_dash', { users: users });
      console.log(users);
    }
}); 
});
router.get('/user_profile', ensureAuthenticated,authorizeRoles("user"), function(req, res , next) {
  email: req.user.email,
  
  User.find( {email: req.user.email},function(err, users) {
    if (err) {
      console.log(err);
    } else {
      res.render('user_profile', { users: users});
      console.log(users);
    }
}); 
});
router.get('/admin_profile', ensureAuthenticated, authorizeRoles("admin"),function(req, res , next) {
  email: req.user.email,
  
  User.find( {email: req.user.email},function(err, users) {
    if (err) {
      console.log(err);
    } else {
      res.render('admin_profile', { users: users});
      console.log(users);
    }
}); 
});
router.get('/incharge_profile', ensureAuthenticated,authorizeRoles("incharge"), function(req, res , next) {
  email: req.user.email,
  
  User.find( {email: req.user.email},function(err, users) {
    if (err) {
      console.log(err);
    } else {
      res.render('incharge_profile', { users: users});
      console.log(users);
    }
}); 
});
router.get('/authority_profile', ensureAuthenticated,authorizeRoles("authority"), function(req, res , next) {
  email: req.user.email,
  
  User.find( {email: req.user.email},function(err, users) {
    if (err) {
      console.log(err);
    } else {
      res.render('authority_profile', { users: users});
      console.log(users);
    }
}); 
});


/* DELETE User BY ID */
router.get('/delete_query_:id',ensureAuthenticated,authorizeRoles("user"), function(req, res) {
  Queryy.findByIdAndRemove(req.params.id, function (err, project) {
    if (err) {
    
    req.flash('error_msg', 'Query Not Deleted');
    res.redirect('../view_query');
    } 
    else {
      req.flash('success_msg', 'Query Deleted');
      res.redirect('../view_query');
    }
  });
});  
router.get('/delete_student_:id',ensureAuthenticated, authorizeRoles("authority"),function(req, res) {
  User.findByIdAndRemove(req.params.id, function (err, project) {
    if (err) {
    
    req.flash('error_msg', 'Student Data Not Deleted');
    res.redirect('../view_all_students');
    } 
    else {
      req.flash('success_msg', 'Student Data Deleted');
      res.redirect('../view_all_students');
    }
  });
});
router.get('/delete_student1_:id',ensureAuthenticated, authorizeRoles("admin"),function(req, res) {
  User.findByIdAndRemove(req.params.id, function (err, project) {
    if (err) {
    
    req.flash('error_msg', 'Student Data Not Deleted');
    res.redirect('../view_all_students1');
    } 
    else {
      req.flash('success_msg', 'Student Data Deleted');
      res.redirect('../view_all_students1');
    }
  });
});
router.get('/delete_admin_:id',ensureAuthenticated,authorizeRoles("authority"), function(req, res) {
  User.findByIdAndRemove(req.params.id, function (err, project) {
    if (err) {
    
    req.flash('error_msg', 'Admin Data Not Deleted !!!');
    res.redirect('../view_all_admins');
    } 
    else {
      req.flash('success_msg', 'Admin Data Deleted !!!');
      res.redirect('../view_all_admins');
    }
  });
});
router.get('/delete_incharge_:id',ensureAuthenticated, authorizeRoles("authority"),function(req, res) {
  User.findByIdAndRemove(req.params.id, function (err, project) {
    if (err) {
    
    req.flash('error_msg', 'Incharge Data Not Deleted !!!');
    res.redirect('../view_all_incharges');
    } 
    else {
      req.flash('success_msg', 'Incharge Data Deleted');
      res.redirect('../view_all_incharges');
    }
  });
});
router.get('/delete_incharge1_:id',ensureAuthenticated, authorizeRoles("authority"),function(req, res) {
  User.findByIdAndRemove(req.params.id, function (err, project) {
    if (err) {
    
    req.flash('error_msg', 'Incharge Data Not Deleted !!!');
    res.redirect('../view_all_incharges1');
    } 
    else {
      req.flash('success_msg', 'Incharge Data Deleted');
      res.redirect('../view_all_incharges1');
    }
  });
});
router.get('/delete_announce_:id',ensureAuthenticated, authorizeRoles("authority"),function(req, res) {
  Announces.findByIdAndRemove(req.params.id, function (err, project) {
    if (err) {
    
    req.flash('error_msg', 'Announce Not Deleted !!!');
    res.redirect('../announcement2');
    } 
    else {
      req.flash('success_msg', 'Announcement Deleted');
      res.redirect('../announcement2');
    }
  });
});
router.get('/update_all_query_:id', ensureAuthenticated,authorizeRoles("authority"),function(req, res) {
  console.log(req.params.id);
  email: req.user.email;
  console.log(req.user.email)
  
  User.find({email: req.user.email },function(err, data) {
    if (err) {
      console.log(err);
    }
    
  
  Queryy.findById(req.params.id,req.body, function (err, user) {
    related_to: user.related_to
    console.log(user.related_to)
    console.log(user.incharge_email)
        User.find( { field: user.related_to},function(err, datas) {
      if (err) {
        console.log(err);
      }
      User.find( { email: user.incharge_email},function(err, datass) {
        if (err) {
          console.log(err);
        }
    if (err) {
      console.log(err);
    } else {
      console.log(user);
       
      res.render('update_all_query', {users: user, data:data , datas :datas , datass :datass});
    }
  });
});
});
});
});
 
      /* GET SINGLE User BY ID */
      router.get('/update_query_:id', ensureAuthenticated,authorizeRoles("admin"),function(req, res) {
        console.log(req.params.id);
        email: req.user.email;
        console.log(req.user.email)
        
        User.find({email: req.user.email },function(err, data) {
          if (err) {
            console.log(err);
          }
          
        
        Queryy.findById(req.params.id,req.body, function (err, user) {
          related_to: user.related_to
          console.log(user.related_to)
          console.log(user.incharge_email)
              User.find( { role:"incharge"},function(err, datas) {
            if (err) {
              console.log(err);
            }
            User.find( { email: user.incharge_email},function(err, datass) {
              if (err) {
                console.log(err);
              }
          if (err) {
            console.log(err);
          } else {
            console.log(user);
             
            res.render('update_query', {users: user, data:data , datas :datas , datass :datass});
          }
        });
      });
    });
    });
      });
       
      /* UPDATE User */
      router.post('/update_query_:id',ensureAuthenticated, function(req, res) {
        Queryy.findByIdAndUpdate(req.params.id, req.body, function (err) {
          if(err){
            req.flash('error_msg', 'Something went wrong! User could not updated.');
            console.log(err)
            res.redirect(''+req.params.id);
        } else {
          req.flash(
            'success_msg',
            'Problem Assigned / Committed Successfully!');
          res.redirect('../admin_dashboard');
        }
        });
      });
      
           /* GET SINGLE User BY ID */
           router.get('/update_own_query_:id', ensureAuthenticated,authorizeRoles("user"),function(req, res) {
            console.log(req.params.id);
            email: req.user.email;
            console.log(req.user.email)
            
            User.find({email: req.user.email },function(err, data) {
              if (err) {
                console.log(err);
              }
              
            
            Queryy.findById(req.params.id,req.body, function (err, user) {
              related_to: user.related_to
              console.log(user.related_to)
              console.log(user.incharge_email)
                  User.find( { field: user.related_to},function(err, datas) {
                if (err) {
                  console.log(err);
                }
                User.find( { email: user.incharge_email},function(err, datass) {
                  if (err) {
                    console.log(err);
                  }
              if (err) {
                console.log(err);
              } else {
                console.log(user);
                 
                res.render('update_own_query', {users: user, data:data , datas :datas , datass :datass});
              }
            });
          });
        });
        });
          });
           
          /* UPDATE User */
          router.post('/update_own_query_:id',ensureAuthenticated,authorizeRoles("user"), function(req, res) {
            Queryy.findByIdAndUpdate(req.params.id, req.body, function (err) {
              if(err){
                req.flash('error_msg', 'Something went wrong! User could not updated.');
                console.log(err)
                res.redirect(''+req.params.id);
            } else {
              req.flash(
                'success_msg',
                'Status / Final Feedback submitted Successfully!');
              res.redirect('../view_query');
            }
            });
          });
          
           /* GET SINGLE User BY ID */
           router.get('/update_incharge_query_:id', ensureAuthenticated,authorizeRoles("incharge"),function(req, res) {
            console.log(req.params.id);
            email: req.user.email;
            console.log(req.user.email)
            
            User.find({email: req.user.email },function(err, data) {
              if (err) {
                console.log(err);
              }
              
            
            Queryy.findById(req.params.id,req.body, function (err, user) {
              related_to: user.related_to
              console.log(user.related_to)
              console.log(user.incharge_email)
                  User.find( { field: user.related_to},function(err, datas) {
                if (err) {
                  console.log(err);
                }
                User.find( { email: user.incharge_email},function(err, datass) {
                  if (err) {
                    console.log(err);
                  }
              if (err) {
                console.log(err);
              } else {
                console.log(user);
                 
                res.render('update_incharge_query', {users: user, data:data , datas :datas , datass :datass});
              }
            });
          });
        });
        });
          });
           
          /* UPDATE User */
          router.post('/update_incharge_query_:id',ensureAuthenticated,authorizeRoles("incharge"), function(req, res) {
            Queryy.findByIdAndUpdate(req.params.id, req.body, function (err) {
              if(err){
                req.flash('error_msg', 'Something went wrong! User could not updated.');
                console.log(err)
                res.redirect(''+req.params.id);
            } else {
              req.flash(
                'success_msg',
                'Status Changes Successfully!');
              res.redirect('../incharge_dashboard');
            }
            });
          });
          
/* Update User Profile */
/* UPDATE User */
router.get('/user_profile_edit_:id', ensureAuthenticated,authorizeRoles("user"),function(req, res) {
  console.log(req.params.id);
  User.findById(req.params.id, function (err, user) {
    if (err) {
      console.log(err);
    } else {
      console.log(user);
       
      res.render('user_profile_edit', {users: user });
    }
  });
});
router.get('/admin_profile_edit_:id', ensureAuthenticated,authorizeRoles("admin"),function(req, res) {
  console.log(req.params.id);
  User.findById(req.params.id, function (err, user) {
    if (err) {
      console.log(err);
    } else {
      console.log(user);
       
      res.render('admin_profile_edit', {users: user });
    }
  });
});
router.get('/incharge_profile_edit_:id', ensureAuthenticated,authorizeRoles("incharge"),function(req, res) {
  console.log(req.params.id);
  User.findById(req.params.id, function (err, user) {
    if (err) {
      console.log(err);
    } else {
      console.log(user);
       
      res.render('incharge_profile_edit', {users: user });
    }
  });
});
router.get('/authority_profile_edit_:id', ensureAuthenticated,authorizeRoles("authority"),function(req, res) {
  console.log(req.params.id);
  User.findById(req.params.id, function (err, user) {
    if (err) {
      console.log(err);
    } else {
      console.log(user);
       
      res.render('authority_profile_edit', {users: user });
    }
  });
});
router.post('/authority_profile_edit_:id',ensureAuthenticated, authorizeRoles("authority"),function(req, res) {
  User.findByIdAndUpdate(req.params.id, req.body, function (err) {
    if(err){
      req.flash('error_msg', 'Something went wrong! User could not updated.');
      res.redirect('authority_edit/'+req.params.id);
  } else {
    req.flash(
      'success_msg',
      'PROFILE UPDATED SUCCESSFULLY!');
    res.redirect('../authority_profile');
  }
  });
});
router.post('/user_profile_edit_:id',ensureAuthenticated, authorizeRoles("user"),function(req, res) {
  User.findByIdAndUpdate(req.params.id, req.body, function (err) {
    if(err){
      req.flash('error_msg', 'Something went wrong! User could not updated.');
      res.redirect('user_profile_edit/'+req.params.id);
  } else {
    req.flash(
      'success_msg',
      'PROFILE UPDATED SUCCESSFULLY!');
    res.redirect('../user_profile');
  }
  });
});
router.post('/incharge_profile_edit_:id',ensureAuthenticated,authorizeRoles("incharge"), function(req, res) {
  User.findByIdAndUpdate(req.params.id, req.body, function (err) {
    if(err){
      req.flash('error_msg', 'Something went wrong! User could not updated.');
      res.redirect('incharge_profile_edit/'+req.params.id);
  } else {
    req.flash(
      'success_msg',
      'PROFILE UPDATED SUCCESSFULLY!');
    res.redirect('../incharge_profile');
  }
  });
});
router.post('/admin_profile_edit_:id',ensureAuthenticated,authorizeRoles("admin"), function(req, res) {
  User.findByIdAndUpdate(req.params.id, req.body, function (err) {
    if(err){
      req.flash('error_msg', 'Something went wrong! User could not updated.');
      res.redirect('admin_profile_edit/'+req.params.id);
  } else {
    req.flash(
      'success_msg',
      'PROFILE UPDATED SUCCESSFULLY!');
    res.redirect('../admin_profile');
  }
  });
});

module.exports = router;
