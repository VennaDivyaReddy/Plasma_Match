
from flask import Flask, abort
from flask import request, Response
from flask_cors import CORS
from flask import jsonify
import mysql.connector
from datetime import date, datetime
import mysql.connector as mc

# Storing connection objects as Global variables
myconnection=None
mycursor=None
def start_connection():
    global myconnection;
    global mycursor;
    import mysql.connector as mc
    myconnection=mc.connect(host='localhost',database='plasma_donor',user='root',password='password')
    mycursor=myconnection.cursor()

def run_query(query):
    start_connection()
    mycursor.execute(query)
    end_connection()

def end_connection():
    myconnection.commit()
    mycursor.close()
    myconnection.close()

app = Flask(__name__)
CORS(app)

# step 1 : create the route -> /get/org/preference 
# This is for get call to show preference table 
@app.route('/get/org/preference')
def show_index():
    # print(get_org_preference());
    return jsonify(process_result_set(get_org_preference()))
    # return {"name":"John"}
# This is for get call to show donation records
@app.route('/get/org/records')
def show_records():
    # print(get_org_preference());
    return jsonify(org_process_result_set(get_org_records()))
    # return {"name":"John"}

# This is for post call for update of preference 
@app.route('/update/preference', methods=['POST'])
def update_preference():
    request_data = request.get_json();
    print("received "+ request_data.get('date'));
    print("received "+ request_data.get('org_name'));
    don_pref(request_data.get('org_id'),request_data.get('date'),request_data.get('user_id'));    
    return jsonify(str(request_data));
    # return {"name":"John"}

# REST Call
# This is for post call for login
@app.route('/login', methods=['POST'])
def check_login():
    request_data = request.get_json();
    user_name = request_data.get('userName');
    password =  request_data.get('password');
    role =  request_data.get('role');
    return jsonify((validate_user_cred(user_name, password, role)));


# This is for post call for update of donation record from donor side
@app.route('/update/donation', methods=['POST'])
def update_donation():
    request_data = request.get_json();
    date = request_data.get('date');
    org_id=  request_data.get('org_id');
    comment= request_data.get('comments');
    user_id= request_data.get('user_id');
    print(request_data)
    update_plasma_donation_record(org_id, date=date, comment=comment,user_id=user_id);    
    return jsonify(str(request_data));

# This is for post ca for update of donation record from org side
@app.route('/org/update/donation', methods=['POST'])
def org_update_donation():
    request_data = request.get_json();
    #print("*"*8);
    print(request_data)
    date = request_data.get('date');
    don_id=  request_data.get('don_id');
    amt=  request_data.get('amt');
    comments= request_data.get('comments');
    user_id=request_data.get('user_id');
    org_update_plasma_donation(don_id,user_id, date,amt,comments);    
    return jsonify(str(request_data));

# This is sql query that updates preference data
def don_pref(org_id,date,user_id):
    
    don_pref_query=f"insert into DONOR_PREFERS values({user_id},{org_id},'{date.split('T')[0].replace('-','/')}','{date.split('T')[-1]}');"
    
    run_query(don_pref_query)
    #print(don_pref_query)    

# helper method
# This is sql query that updates donation record from donor side
def update_plasma_donation_record(org_id, date, comment,user_id):
    
    update_plasma_record_query=f"insert into DONOR_DONATES values({user_id},{org_id},'{date.split('T')[0].replace('-','/')}','{date.split('T')[-1]}',NULL,'{comment}');"
    print(update_plasma_record_query);
    run_query(update_plasma_record_query)
    print(update_plasma_record_query);
    
# This is sql query that updates donation record from org side
def org_update_plasma_donation(don_id,user_id, date,amt, comment):
    
    org_plasma_record_query=f"insert into DONOR_DONATES values({don_id},{user_id},'{date.split('T')[0].replace('-','/')}','{date.split('T')[-1]}',{amt},'{comment}');"
    print(org_plasma_record_query);
    #curs.execute(sql);
    run_query(org_plasma_record_query)
    
    
# step 2 -> write sql code to fetch the record -. this will return [()]    

# This is sql query that gets records from donor preference table
def get_org_preference():
    start_connection()
    mycursor.execute("select D_ID, ORG_ID,DATE_FORMAT(P_DATE,'%m/%d/%y'),P_TIME  from DONOR_PREFERS")
    c=mycursor.fetchall()
    end_connection()
    return(c)
    
# This is sql query that gets records from donation record table   
def get_org_records():
    start_connection()
    mycursor.execute("select D_ID,DATE_FORMAT(D_DATE,'%m/%d/%y'),TIME,AMOUNT,COMMENTS,ORG_ID  from DONOR_DONATES")
    c=mycursor.fetchall()
    end_connection()
    return(c)

# step 3 -> convert [()] to [{}]
def process_result_set(records):
    #  converts array of tuples to array of json
    to_return = [];
    for record in records:
        json_sample = {}
        json_sample["donorId"] = record[0];
        json_sample["orgId"] = record[1];
        json_sample["date"] = record[2];
        json_sample["time"] = str(record[3]);
        # json_sample["id"] = record[0
        to_return.append(json_sample);
    return to_return;      

def org_process_result_set(records):
    #  converts array of tuples to array of json
    to_return = [];
    for record in records:
        json_sample = {}
        json_sample["donorId"] = record[0];
        json_sample["date"] = record[1];
        json_sample["time"] = str(record[2]);
        json_sample["amount"] = record[3];
        json_sample["comments"] = record[4];
        json_sample["org_id"] = record[5];
        # json_sample["id"] = record[0
        to_return.append(json_sample);
    return to_return;      

def validate_user_cred(userName, password, role):
    query = f"select PASSWORD from USER_ACCOUNT where USER_NAME = '{userName}'";
    # check if password is correct
    start_connection() 
    mycursor.execute(query);
    try:
        enc_password = mycursor.fetchall()[0][0];
    except Exception as ae:
        abort(401)

    if(validate_password(password, enc_password)):
        # code
        #  select t1.acc_id,user_name,roll_id, t2.DONOR_ID from USER_ACCOUNT t1 left join DONOR t2 on ( t1.acc_id = t2.acc_id) where t1.user_name = 'Donor_01';
        query = None;
        if(role == 1):
            query = f"select t1.acc_id,user_name,t2.DONOR_ID from USER_ACCOUNT t1 left join DONOR t2 on ( t1.acc_id = t2.acc_id) where t1.user_name = '{userName}';"
        elif(role == 2):
            query = f"select t1.acc_id,user_name,t2.ORG_ID from USER_ACCOUNT t1 left join ORGANISATION t2 on ( t1.acc_id = t2.acc_id) where t1.user_name = '{userName}';"
        # check if password is correct 
        mycursor.execute(query);
        response = mycursor.fetchone();
        return {
            "acc_id": response[0],
            "role_id": role,
            "user_name": response[1],
            "user_id":response[2],
            "loggedIn": 1
        }
    else:
        abort(401)
    # return account id and role id 
    end_connection()
    # throw error 
    return(c)

def validate_password(password, enc_password):
    import hashlib
    return hashlib.md5(password.encode()).hexdigest() == enc_password



@app.errorhandler(401)
def custom_401(error):
    end_connection()
    return Response('Your user-name or password is wrong , please try again', 401, {'WWW-Authenticate':'Basic realm="Login Required"'})