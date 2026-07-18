export function useCalendarNavigation(
    selectedDate,
    setSelectedDate
) {

    const changeDay = (amount) => {

        const date = new Date(selectedDate);

        date.setDate(date.getDate() + amount);

        setSelectedDate(
            date.toISOString().split("T")[0]
        );

    };

    const goToToday = () => {

        setSelectedDate(
            new Date().toISOString().split("T")[0]
        );

    };

    const goToPreviousMonth = () => {

        const date = new Date(selectedDate);

        date.setMonth(date.getMonth() - 1);

        setSelectedDate(
            date.toISOString().split("T")[0]
        );

    };

    const goToNextMonth = () => {

        const date = new Date(selectedDate);

        date.setMonth(date.getMonth() + 1);

        setSelectedDate(
            date.toISOString().split("T")[0]
        );

    };

    return {

        changeDay,
        goToToday,
        goToPreviousMonth,
        goToNextMonth,

    };

}