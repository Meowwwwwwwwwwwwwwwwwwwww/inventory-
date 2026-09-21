

function LoadingState() {



return (



    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">



      <div className="space-y-4 p-6">



        {[1, 2, 3, 4].map((item) => (



          <div



            key={item}



            className="h-12 animate-pulse rounded-lg bg-slate-100"



          />



        ))}



      </div>



    </div>



  );



}



export default App;