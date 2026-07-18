import Filters from "./Filters";
import ViewSwitch from "./ViewSwitch";

function ToolbarSection({

    search,
    setSearch,

    filter,
    setFilter,

    view,
    setView,

}) {

    return (

        <>
        <div className="search-box">
        
            <input
                type="text"
                placeholder="Görev Ara"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
        
        </div>

        <Filters
            
            filter={filter}
            setFilter={setFilter}
            
        />

            <ViewSwitch
            
                view={view}
                setView={setView}
            
            />
        </>

    );

}

export default ToolbarSection;