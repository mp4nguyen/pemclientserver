var getPort = function(){
    console.log("Current length port is : " +(window.location.port.length   + ""));
    if(window.location.port.length ==0)
    {
        console.log('api port = 443');
        return 443;
    }else{
        console.log('api port = 8181');
        return 8181;
    }
};

var apiUrl = "https://medicalbookings.redimed.com.au";

var getLogo = function(){
  return "REDIMED";
}
