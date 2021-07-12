using System;
using System.ComponentModel;
using System.Numerics;
using Neo;
using Neo.SmartContract.Framework;
using Neo.SmartContract.Framework.Native;
using Neo.SmartContract.Framework.Services;
namespace Whisker
{
    [DisplayName("Fuzious.WhiskerContract")]
    [ManifestExtra("Author", "Fuzious")]
    [ManifestExtra("Description", "NEP17 standard for Cattery")]
    public partial class WhiskerContract : SmartContract
    {
        const string MAP_NAME = "Whisker";
        const string NFT_to_Holder = "NFT_to_holder";
        const string Holder_to_NFT = "holder_to_nft";

        const string mint_count = "mint_count";

        static readonly ulong InitialSupply = 100_000_000;
        static BigInteger tokenthreshold=1;
        static BigInteger  REQUESTID=0;
        static UInt160  owner;

        public static bool changeTokenThreshold(BigInteger value){
            var tx = (Transaction) Runtime.ScriptContainer;
             if((Neo.UInt160) tx.Sender!=owner){
                 throw new Exception("ERROR:YOU ARE NOT AUTHORISED");
             }
            tokenthreshold=value;
            return true;
        }

        public static BigInteger TotalSupply() => InitialSupply;
        
        public static string Symbol() => "WSK";

        public static ulong Decimals() => 2;



        [DisplayName("Transfer")]
        public static event Action<UInt160, UInt160, BigInteger> OnTransfer;

        private static StorageMap Balances => new StorageMap(Storage.CurrentContext, MAP_NAME);
        
        private static StorageMap OwnerInviteeLeft => new StorageMap(Storage.CurrentContext,"OwnerNumber");


        private static StorageMap WhoInvited=> new StorageMap(Storage.CurrentContext,"whoinvited");

        private static StorageMap OwnerActive=> new StorageMap(Storage.CurrentContext,"Owner_active");

        private static StorageMap OwnerNftDetails => new StorageMap(Storage.CurrentContext,"nftdetails");
        private static StorageMap InviteeNftDetails => new StorageMap(Storage.CurrentContext,"inviteedetails");
        private static StorageMap lockPool => new StorageMap(Storage.CurrentContext,"lookPoolHolder");

        public static BigInteger GetOwnerInviteeLeft(UInt160 key)=> (BigInteger) OwnerInviteeLeft.Get(key);

        private static void PutOwnerInviteeLeft(UInt160 key,BigInteger amount)=> OwnerInviteeLeft.Put(key,amount);

        public static BigInteger GetOwnerActive(UInt160 key)=>(BigInteger) OwnerActive.Get(key);

        private static void PutOwnerActive(UInt160 key, BigInteger status)=> OwnerActive.Put(key,status);

        public static UInt160 GetWhoInvited(UInt160 key)=>(UInt160) OwnerActive.Get(key);

        private static void PutWhoInvited(UInt160 key, UInt160 invitee)=> OwnerActive.Put(key,invitee);
        
        public static string getOwnerNftDetails(UInt160 key)=>(string) OwnerNftDetails.Get(key);
        public static string getInviteeNftDetails(UInt160 key)=>(string) InviteeNftDetails.Get(key);
        private static void putOwnerNftDetails(UInt160 key,string uri)=> OwnerNftDetails.Put(key,uri);

        private static void putInviteeNftDetails(UInt160 key,string uri)=> InviteeNftDetails.Put(key,uri);

        
        public static BigInteger GetLockPoolAmount(UInt160 key)=> (BigInteger) lockPool.Get(key);
        private static void PutLockPoolAmount(UInt160 key, BigInteger value) => lockPool.Put(key, value);

        public static BigInteger Get(UInt160 key) => (BigInteger) Balances.Get(key);

        private static void Put(UInt160 key, BigInteger value) => Balances.Put(key, value);

        


        
        private static void Increase(UInt160 key, BigInteger value)
        {
            Put(key, Get(key) + value);
        }

        private static void Reduce(UInt160 key, BigInteger value)
        {
            var oldValue = Get(key);
            if (oldValue == value)
            {
                Balances.Delete(key);
            }
            else
            {
                Put(key, oldValue - value);
            }
            
        }

        public static bool Transfer(UInt160 from, UInt160 to, BigInteger amount, object data)
        {
            if (!from.IsValid || !to.IsValid)
            {
                throw new Exception("The parameters from and to should be 20-byte addresses");
            }

            if (amount < 0) 
            {
                throw new Exception("The amount parameter must be greater than or equal to zero");
            }

            if (!from.Equals(Runtime.CallingScriptHash) && !Runtime.CheckWitness(from))
            {
                throw new Exception("No authorization.");
            }
            
            if (Get(from) < amount)
            {
                throw new Exception("Insufficient balance");
            }

            Reduce(from, amount);
            Increase(to, amount);
            OnTransfer(from, to, amount);

            if (ContractManagement.GetContract(to) != null)
            {
                Contract.Call(to, "onPayment", CallFlags.None, new object[] { from, amount, data });
            }
            
            return true;
        }
        static readonly string PreData = "RequstData";

        public static string GetRequstData()
        {
            return Storage.Get(Storage.CurrentContext, PreData);
        }

        public static BigInteger BalanceOf(UInt160 account)
        {
            return Get(account);
        }

        [DisplayName("_deploy")]
        public static void Deploy(object data, bool update)
        {
            update=true;
            if (update)
            {
                var tx = (Transaction) Runtime.ScriptContainer;
                owner = (Neo.UInt160) tx.Sender;
                Increase(owner, InitialSupply);
                OnTransfer(null, owner, InitialSupply);
                PutLockPoolAmount(owner,tokenthreshold);
                PutOwnerActive(owner,1);
                putOwnerNftDetails(owner,"theownerthegenesis");
                PutOwnerInviteeLeft(owner,2);

                Storage.Put(Storage.CurrentContext, "internalReqId", "0");
            }
        }

        public static bool initOwner(){
            var tx = (Transaction) Runtime.ScriptContainer;
            var accounter = (Neo.UInt160) tx.Sender;
            if(accounter!=owner){
                throw new Exception("owner only function");
            }
            Increase(owner, InitialSupply);
            OnTransfer(null, owner, InitialSupply);
            PutLockPoolAmount(owner,tokenthreshold);
            PutOwnerActive(owner,1);
            putOwnerNftDetails(owner,"theownerthegenesis");
            PutOwnerInviteeLeft(owner,2);
            return true;

        }


        // NFT implemented here

        public static UInt160 ContractAddress() {
            return ContractManagement.Hash;
        }

        public static bool LockToken(UInt160 from, object data) {
            PutLockPoolAmount(from,tokenthreshold);
            return Transfer(from, ContractManagement.Hash, tokenthreshold, data);
        }

        public static bool withdrawTokens(object data){

            var tx = (Transaction) Runtime.ScriptContainer;
            UInt160 account = (Neo.UInt160) tx.Sender;            
            BigInteger balance = GetLockPoolAmount(account);
            if(balance==0){
                throw new Exception("You have no token locked");
            }
            PutLockPoolAmount(account,0);
            PutOwnerActive(account,0);
            PutOwnerInviteeLeft(account,0);

            return Transfer(ContractManagement.Hash,account,balance,data);
        }

        public static bool transferNft(UInt160 to){
            var tx = (Transaction) Runtime.ScriptContainer;
            var account= (Neo.UInt160) tx.Sender;
            BigInteger tokenslocked=GetLockPoolAmount(account);
            BigInteger inviteeleft= GetOwnerInviteeLeft(account);
            BigInteger tokenLockedreciver= GetLockPoolAmount(to);
            string gethash= getInviteeNftDetails(account);
            if (gethash==null){
                throw new Exception("please mint an nft first");
            }
            if(inviteeleft>0&&tokenslocked>=tokenthreshold&&tokenLockedreciver>=tokenthreshold&&GetOwnerActive(to)==0){
                PutOwnerInviteeLeft(account,inviteeleft-1);
                PutOwnerActive(to,1);
                string details = getInviteeNftDetails(account);
                putOwnerNftDetails(to,details);
                PutOwnerInviteeLeft(to,2);

            }
            else{
                throw new Exception("error occured while transfer");
            }
            return true;

        }

        private static bool internalmint(UInt160 account ,string uri) {
            BigInteger statusInviter= GetOwnerActive(account);
            BigInteger balance= GetLockPoolAmount(account);
            var tx = (Transaction) Runtime.ScriptContainer;
            var caller= (Neo.UInt160) tx.Sender;
        
        // as this is a self calling function
            if (!(balance>=tokenthreshold)){
                throw new Exception("token staked less then threshold or, some other issue has occured");
            }
            // if (GetOwnerInviteeLeft(account)<=0) {
            //     throw new Exception("No futher invites left.");
            // }

            putInviteeNftDetails(account,uri);


            
            return true;
        }
        
        private static StorageMap RequestToAddress => new StorageMap(Storage.CurrentContext,"requesttoaddress");
        public static UInt160 getRequestoAddress(string key)=> (UInt160) RequestToAddress.Get(key);
        private static void putRequesttoAddress(string key,UInt160 id)=> RequestToAddress.Put(key,id);
        public static void mint()
        {
            var tx = (Transaction) Runtime.ScriptContainer;
            var account= (Neo.UInt160) tx.Sender;
            if ( GetOwnerActive(account) == 1 && GetOwnerInviteeLeft(account)>0) {
                
                string filter = "$.hash";
                string url=StdLib.Base64Encode("https://www.cattery-backend.ml/generate/"+(ByteString) account);
                byte[] userData = {};
                string callback = "callback";
                long gasForResponse = Oracle.MinimumResponseFee;
                // Storage.Put(Storage.CurrentContext, "internalReqAddress", account);
                putRequesttoAddress("0",account);
                Oracle.Request(url, filter, callback, userData, gasForResponse);
            } else {
                throw new Exception("Minter has no nft for himself");
            }
        }

        public static void Callback(string url, byte[] userData, int code, byte[] result)
        {
            if (Runtime.CallingScriptHash != Oracle.Hash) throw new Exception("Unauthorized!");
            Storage.Put(Storage.CurrentContext, PreData, result.ToByteString());
            string generatedUri= result.ToByteString();
            UInt160 getAddress= getRequestoAddress("0");
            
            internalmint(getAddress,generatedUri);
        }
    }
}
