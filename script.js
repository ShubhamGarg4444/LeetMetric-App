document.addEventListener("DOMContentLoaded", function()
{
    const searchButton = document.getElementById("search-btn") ;
    const usernameInput = document.getElementById("user-input") ;
    const statsContainer = document.querySelector(".stats-container") ;
    const easyProgressCircle = document.querySelector(".easy-progress") ;
    const mediumProgressCircle = document.querySelector(".medium-progress") ;
    const hardProgressCircle = document.querySelector(".hard-progress") ;
    const easyLabel = document.getElementById("easy-label") ;
    const mediumLabel = document.getElementById("medium-label") ;
    const hardLabel = document.getElementById("hard-label") ;
    const cardStatsContainer = document.querySelector(".stats-card") ;

    // return true or false based on a regular expression
    function validateUsername(username)
    {
        if(username.trim() === "")
            {
                alert("username should not be empty") ;
                return false ;
            }
            const regex = /^[a-zA-Z0-9_-]{1,15}$/ ;
            const isMatching = regex.test(username) ;
            if(!isMatching)
                {
                    alert("Invalid Username") ;
                }
            return isMatching ;
    }

    async function fetchUserDetails(username)
    {
        const url = `https://leetcode-stats-api.herokuapp.com/${username}` ;
        try{
            searchButton.textContent = "Searching..." ;
            searchButton.disabled = true ;
            statsContainer.style.setProperty("display", "hidden") ;

            const response = await fetch(url) ;
            if(!response.ok)
                {
                    throw new Error("Unable to fetch the User details") ;
                }
                const parsedData = await response.json() ;
                console.log("Logging data: ", parsedData) ;

                displayUserData(parsedData) ;
        }
        catch(error)
        {
            statsContainer.innerHTML = `<p>${error.message}</p>` ;
        }
        finally{
            searchButton.textContent = "Search" ;
            searchButton.disabled = false ;
        }
    }


    function updateProgress(solved, total, label, circle)
    {
        const progressDegree = (solved/total)*100 ;
        circle.style.setProperty("--progress-degree", `${progressDegree}%`) ;
        label.textContent = `${solved}/${total}` ;
    }

    function displayUserData(parsedData)
    {
        const totalQues = parsedData.totalQuestions ;
        const totalEasyQues = parsedData.totalEasy ;
        const totalMediumQues = parsedData.totalMedium ;
        const totalHardQues = parsedData.totalHard ;

        const solvedTotalQues = parsedData.totalSolved ;
        const solvedTotalEasyQues = parsedData.easySolved ;
        const solvedTotalMediumQues = parsedData.mediumSolved ;
        const solvedTotalHardQues = parsedData.hardSolved ;

        updateProgress(solvedTotalEasyQues, totalEasyQues, easyLabel, easyProgressCircle) ;
        updateProgress(solvedTotalMediumQues, totalMediumQues, mediumLabel, mediumProgressCircle) ;
        updateProgress(solvedTotalHardQues, totalHardQues, hardLabel, hardProgressCircle) ;

        const cardData = [
            {label: "Acceptance Rate", value:parsedData.acceptanceRate},
            {label: "Ranking", value:parsedData.ranking},
            {label: "Contribution Points", value:parsedData.contributionPoints},
            {label: "Reputation", value:parsedData.reputation},
        ] ;
        console.log("Card Data is - ", cardData) ;

        cardStatsContainer.innerHTML = cardData.map(
            data => {
                return `
                <div class="card">
                <h4>${data.label}</h4>
                <p>${data.value}</p>
                </div>
                `
            }
        ).join("")
    }

    searchButton.addEventListener('click', function()
{
    const username = usernameInput.value ;
    console.log("Logging username: ",username) ;
    if(validateUsername(username))
        {
            fetchUserDetails(username) ;
        }
})

})



